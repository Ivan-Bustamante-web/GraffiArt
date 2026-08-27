const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function createToken(usuarioId, tipo, minutes) {
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.tokenAcceso.create({
    data: { tokenHash: hashToken(token), tipo, usuarioId, expiraEn: new Date(Date.now() + minutes * 60000) },
  });
  return token;
}

async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email desarrollo] ${to}: ${subject}`);
    console.log(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    return;
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.MAIL_FROM || 'GraffiArt <onboarding@resend.dev>', to: [to], subject, html }),
  });
  if (!response.ok) throw new Error('No se pudo enviar el correo');
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email: email?.trim().toLowerCase() } });
    if (!usuario || !password || !(await bcrypt.compare(password, usuario.passwordHash))) return res.status(401).json({ error: 'Credenciales inválidas' });
    if (!usuario.emailVerificado) return res.status(403).json({ error: 'Primero verificá tu email' });
    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, rol: usuario.rol } });
  } catch (error) { res.status(500).json({ error: error.message }); }
}

async function register(req, res) {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;
    if (!nombre || !apellido || !email || !password || password.length < 8) return res.status(400).json({ error: 'Datos de registro inválidos' });
    const normalizedEmail = email.trim().toLowerCase();
    const existente = await prisma.usuario.findUnique({ where: { email: normalizedEmail } });
    if (existente) return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
    const usuario = await prisma.usuario.create({ data: { nombre, apellido, email: normalizedEmail, passwordHash: await bcrypt.hash(password, 10), telefono } });
    const token = await createToken(usuario.id, 'VERIFICACION_EMAIL', 60);
    const verificationUrl = `${frontendUrl}/verificar-email?token=${token}`;
    await sendEmail(usuario.email, 'Confirmá tu email en GraffiArt', `<p>Hola ${usuario.nombre}.</p><p><a href="${verificationUrl}">Confirmar mi email</a></p>`);
    res.status(201).json({ message: 'Registro exitoso. Revisá tu email para activar la cuenta.', ...(process.env.NODE_ENV !== 'production' && { verificationUrl }) });
  } catch (error) { res.status(500).json({ error: error.message }); }
}

async function verifyEmail(req, res) {
  try {
    const accessToken = await prisma.tokenAcceso.findFirst({ where: { tokenHash: hashToken(req.query.token || ''), tipo: 'VERIFICACION_EMAIL', usado: false } });
    if (!accessToken || accessToken.expiraEn < new Date()) return res.status(400).json({ error: 'El enlace es inválido o expiró' });
    await prisma.$transaction([
      prisma.usuario.update({ where: { id: accessToken.usuarioId }, data: { emailVerificado: true } }),
      prisma.tokenAcceso.update({ where: { id: accessToken.id }, data: { usado: true } }),
    ]);
    res.json({ message: 'Email verificado. Ya podés iniciar sesión.' });
  } catch (error) { res.status(500).json({ error: error.message }); }
}

async function forgotPassword(req, res) {
  const result = { message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña.' };
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email: req.body.email?.trim().toLowerCase() } });
    if (!usuario) return res.json(result);
    await prisma.tokenAcceso.updateMany({ where: { usuarioId: usuario.id, tipo: 'RECUPERACION_PASSWORD', usado: false }, data: { usado: true } });
    const token = await createToken(usuario.id, 'RECUPERACION_PASSWORD', 30);
    const resetUrl = `${frontendUrl}/restablecer-password?token=${token}`;
    await sendEmail(usuario.email, 'Restablecé tu contraseña de GraffiArt', `<p><a href="${resetUrl}">Restablecer contraseña</a></p>`);
    if (process.env.NODE_ENV !== 'production') result.resetUrl = resetUrl;
    res.json(result);
  } catch (error) { res.status(500).json({ error: error.message }); }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const accessToken = await prisma.tokenAcceso.findFirst({ where: { tokenHash: hashToken(token || ''), tipo: 'RECUPERACION_PASSWORD', usado: false } });
    if (!accessToken || accessToken.expiraEn < new Date() || !password || password.length < 8) return res.status(400).json({ error: 'Token o contraseña inválidos' });
    await prisma.$transaction([
      prisma.usuario.update({ where: { id: accessToken.usuarioId }, data: { passwordHash: await bcrypt.hash(password, 10) } }),
      prisma.tokenAcceso.update({ where: { id: accessToken.id }, data: { usado: true } }),
    ]);
    res.json({ message: 'Contraseña actualizada. Ya podés iniciar sesión.' });
  } catch (error) { res.status(500).json({ error: error.message }); }
}

module.exports = { login, register, verifyEmail, forgotPassword, resetPassword };
