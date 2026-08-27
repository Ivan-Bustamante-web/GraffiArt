import "dotenv/config";
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "./generated/prisma/client.js";

const prisma = new PrismaClient();
const port = Number(process.env.PORT || 3000);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const tokenDurationMs = 60 * 60 * 1000;
const resetDurationMs = 30 * 60 * 1000;

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": frontendUrl,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(body));
}

function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

function createRawToken() {
  return randomBytes(32).toString("hex");
}

async function createAccessToken(usuarioId, tipo, durationMs) {
  const rawToken = createRawToken();
  await prisma.tokenAcceso.create({
    data: { tokenHash: tokenHash(rawToken), tipo, expiraEn: new Date(Date.now() + durationMs), usuarioId },
  });
  return rawToken;
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email desarrollo] Para: ${to} | Asunto: ${subject}`);
    console.log(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    return;
  }

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM || "GraffiArt <onboarding@resend.dev>", to: [to], subject, html }),
  });
  if (!result.ok) throw new Error("No se pudo enviar el correo");
}

async function readBody(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

function validPassword(password) {
  return typeof password === "string" && password.length >= 8;
}

function publicUser(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, rol: usuario.rol };
}

async function register(body) {
  const { nombre, apellido, email, password, telefono } = body;
  if (!nombre || !apellido || !email || !validPassword(password)) throw new Error("Datos de registro inválidos");
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12);
  const usuario = await prisma.usuario.create({ data: { nombre, apellido, email: normalizedEmail, passwordHash, telefono } });
  const token = await createAccessToken(usuario.id, "VERIFICACION_EMAIL", tokenDurationMs);
  const verificationUrl = `${frontendUrl}/verificar-email?token=${token}`;
  await sendEmail({ to: usuario.email, subject: "Confirmá tu email en GraffiArt", html: `<p>Hola ${usuario.nombre}.</p><p><a href="${verificationUrl}">Confirmar mi email</a></p>` });
  return { message: "Registro exitoso. Revisá tu email para activar la cuenta.", ...(process.env.NODE_ENV !== "production" && { verificationUrl }) };
}

async function verifyEmail(token) {
  if (!token) throw new Error("Token inválido");
  const accessToken = await prisma.tokenAcceso.findFirst({ where: { tokenHash: tokenHash(token), tipo: "VERIFICACION_EMAIL", usado: false } });
  if (!accessToken || accessToken.expiraEn < new Date()) throw new Error("El enlace es inválido o expiró");
  await prisma.$transaction([
    prisma.usuario.update({ where: { id: accessToken.usuarioId }, data: { emailVerificado: true } }),
    prisma.tokenAcceso.update({ where: { id: accessToken.id }, data: { usado: true } }),
  ]);
  return { message: "Email verificado. Ya podés iniciar sesión." };
}

async function login(body) {
  const usuario = await prisma.usuario.findUnique({ where: { email: body.email?.trim().toLowerCase() } });
  if (!usuario || !(await bcrypt.compare(body.password || "", usuario.passwordHash))) throw new Error("Email o contraseña incorrectos");
  if (!usuario.emailVerificado) throw new Error("Primero verificá tu email");
  const accessToken = jwt.sign({ sub: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: "2h" });
  return { token: accessToken, usuario: publicUser(usuario) };
}

async function requestPasswordReset(body) {
  const usuario = await prisma.usuario.findUnique({ where: { email: body.email?.trim().toLowerCase() } });
  const result = { message: "Si el email existe, recibirás instrucciones para recuperar tu contraseña." };
  if (!usuario) return result;
  await prisma.tokenAcceso.updateMany({ where: { usuarioId: usuario.id, tipo: "RECUPERACION_PASSWORD", usado: false }, data: { usado: true } });
  const token = await createAccessToken(usuario.id, "RECUPERACION_PASSWORD", resetDurationMs);
  const resetUrl = `${frontendUrl}/restablecer-password?token=${token}`;
  await sendEmail({ to: usuario.email, subject: "Restablecé tu contraseña de GraffiArt", html: `<p><a href="${resetUrl}">Restablecer contraseña</a></p>` });
  if (process.env.NODE_ENV !== "production") result.resetUrl = resetUrl;
  return result;
}

async function resetPassword(body) {
  if (!body.token || !validPassword(body.password)) throw new Error("Token o contraseña inválidos");
  const accessToken = await prisma.tokenAcceso.findFirst({ where: { tokenHash: tokenHash(body.token), tipo: "RECUPERACION_PASSWORD", usado: false } });
  if (!accessToken || accessToken.expiraEn < new Date()) throw new Error("El enlace es inválido o expiró");
  await prisma.$transaction([
    prisma.usuario.update({ where: { id: accessToken.usuarioId }, data: { passwordHash: await bcrypt.hash(body.password, 12) } }),
    prisma.tokenAcceso.update({ where: { id: accessToken.id }, data: { usado: true } }),
  ]);
  return { message: "Contraseña actualizada. Ya podés iniciar sesión." };
}

async function handler(request, response) {
  if (request.method === "OPTIONS") return json(response, 204, {});
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const body = request.method === "POST" ? await readBody(request) : {};
    let result;
    if (request.method === "POST" && url.pathname === "/api/auth/register") result = await register(body);
    else if (request.method === "GET" && url.pathname === "/api/auth/verify-email") result = await verifyEmail(url.searchParams.get("token"));
    else if (request.method === "POST" && url.pathname === "/api/auth/login") result = await login(body);
    else if (request.method === "POST" && url.pathname === "/api/auth/forgot-password") result = await requestPasswordReset(body);
    else if (request.method === "POST" && url.pathname === "/api/auth/reset-password") result = await resetPassword(body);
    else return json(response, 404, { error: "Ruta no encontrada" });
    return json(response, 200, result);
  } catch (error) {
    const status = error.code === "P2002" ? 409 : 400;
    return json(response, status, { error: error.code === "P2002" ? "El email ya está registrado" : error.message });
  }
}

createServer(handler).listen(port, () => console.log(`Backend escuchando en http://localhost:${port}`));

process.on("SIGINT", async () => { await prisma.$disconnect(); process.exit(0); });