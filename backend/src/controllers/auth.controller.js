const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token || '').trim().toLowerCase()).digest('hex');
}

async function createToken(usuarioId, tipo, minutes) {
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.tokenAcceso.create({
    data: {
      tokenHash: hashToken(token),
      tipo,
      usuarioId,
      expiraEn: new Date(Date.now() + minutes * 60000),
    },
  });
  return token;
}

async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email desarrollo] ${to}: ${subject}`);
    console.log(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    return;
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || 'GraffiArt <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      }),
    });
    if (!response.ok) {
      const errText = await response.text();
      console.warn('[Resend API Warning]', response.status, errText);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[email desarrollo fallback] ${to}: ${subject}`);
        return;
      }
      throw new Error('No se pudo enviar el correo de verificación');
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Email warning in dev]', err.message);
      return;
    }
    throw err;
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Debés ingresar email y contraseña' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const usuario = await prisma.usuario.findUnique({ where: { email: normalizedEmail } });
    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      return res.status(401).json({ error: 'Credenciales inválidas. Verificá tu email y contraseña.' });
    }
    if (!usuario.emailVerificado) {
      return res.status(403).json({
        error: 'Tu email aún no está verificado.',
        needsVerification: true,
        email: usuario.email,
      });
    }
    const jwtSecret = process.env.JWT_SECRET || 'graffiart_practica_profesionalizante_3ro_2026';
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      jwtSecret,
      { expiresIn: '8h' }
    );
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}

async function register(req, res) {
  try {
    const { nombre, apellido, email, password, telefono } = req.body || {};
    if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es obligatorio' });
    if (!apellido?.trim()) return res.status(400).json({ error: 'El apellido es obligatorio' });
    if (!email?.trim()) return res.status(400).json({ error: 'El email es obligatorio' });
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existente = await prisma.usuario.findUnique({ where: { email: normalizedEmail } });
    if (existente) return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });

    const usuario = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, 10),
        telefono: telefono?.trim() || null,
      },
    });

    const token = await createToken(usuario.id, 'VERIFICACION_EMAIL', 60);
    const verificationUrl = `${frontendUrl}/verificar-email?token=${token}`;
    await sendEmail(
      usuario.email,
      'Confirmá tu email en GraffiArt',
      `<p>Hola ${usuario.nombre},</p><p>Gracias por registrarte en GraffiArt.</p><p><a href="${verificationUrl}">Confirmar mi email</a></p>`
    );

    res.status(201).json({
      message: 'Registro exitoso. Revisá tu email para activar la cuenta.',
      ...(process.env.NODE_ENV !== 'production' && { verificationUrl, token }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al procesar el registro' });
  }
}

async function resendVerification(req, res) {
  try {
    const { email } = req.body || {};
    if (!email?.trim()) return res.status(400).json({ error: 'Debés ingresar un email' });

    const normalizedEmail = email.trim().toLowerCase();
    const usuario = await prisma.usuario.findUnique({ where: { email: normalizedEmail } });

    if (!usuario) {
      return res.json({ message: 'Si el correo está registrado, enviaremos un enlace de activación.' });
    }

    if (usuario.emailVerificado) {
      return res.status(400).json({ error: 'Este correo ya se encuentra verificado. Podés iniciar sesión.' });
    }

    await prisma.tokenAcceso.updateMany({
      where: { usuarioId: usuario.id, tipo: 'VERIFICACION_EMAIL', usado: false },
      data: { usado: true },
    });

    const token = await createToken(usuario.id, 'VERIFICACION_EMAIL', 60);
    const verificationUrl = `${frontendUrl}/verificar-email?token=${token}`;
    await sendEmail(
      usuario.email,
      'Confirmá tu email en GraffiArt',
      `<p>Hola ${usuario.nombre},</p><p>Hacé clic en el siguiente enlace para activar tu cuenta:</p><p><a href="${verificationUrl}">Activar mi cuenta</a></p>`
    );

    res.json({
      message: 'Enviamos un nuevo enlace de activación a tu correo.',
      ...(process.env.NODE_ENV !== 'production' && { verificationUrl, token }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al reenviar verificación' });
  }
}

async function verifyEmail(req, res) {
  try {
    const rawToken = req.query.token || req.body?.token;
    if (!rawToken) {
      return res.status(400).json({ error: 'El token de verificación es obligatorio' });
    }
    const tokenClean = String(rawToken).trim().toLowerCase();
    const accessToken = await prisma.tokenAcceso.findFirst({
      where: { tokenHash: hashToken(tokenClean), tipo: 'VERIFICACION_EMAIL' },
      include: { usuario: true },
    });

    if (!accessToken) {
      return res.status(400).json({ error: 'El enlace de verificación es inválido' });
    }

    if (accessToken.usado) {
      return res.json({ message: 'Tu cuenta ya está verificada. Podés iniciar sesión.' });
    }

    if (accessToken.expiraEn < new Date()) {
      return res.status(400).json({
        error: 'El enlace de verificación ha expirado. Solicitá uno nuevo.',
        expired: true,
        email: accessToken.usuario?.email,
      });
    }

    await prisma.$transaction([
      prisma.usuario.update({ where: { id: accessToken.usuarioId }, data: { emailVerificado: true } }),
      prisma.tokenAcceso.update({ where: { id: accessToken.id }, data: { usado: true } }),
    ]);

    res.json({ message: '¡Email verificado con éxito! Ya podés iniciar sesión.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al verificar email' });
  }
}

async function forgotPassword(req, res) {
  const genericResult = { message: 'Si el email existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña.' };
  try {
    const { email } = req.body || {};
    if (!email?.trim()) return res.status(400).json({ error: 'Debés ingresar un email' });

    const normalizedEmail = email.trim().toLowerCase();
    const usuario = await prisma.usuario.findUnique({ where: { email: normalizedEmail } });
    if (!usuario) return res.json(genericResult);

    await prisma.tokenAcceso.updateMany({
      where: { usuarioId: usuario.id, tipo: 'RECUPERACION_PASSWORD', usado: false },
      data: { usado: true },
    });

    const token = await createToken(usuario.id, 'RECUPERACION_PASSWORD', 30);
    const resetUrl = `${frontendUrl}/restablecer-password?token=${token}`;

    await sendEmail(
      usuario.email,
      'Restablecé tu contraseña de GraffiArt',
      `<p>Hola ${usuario.nombre},</p><p>Solicitaste restablecer tu contraseña en GraffiArt.</p><p><a href="${resetUrl}">Restablecer contraseña</a></p><p>Si no podés abrir el enlace, ingresá este código en la página de recuperación:</p><p style="word-break: break-all;"><strong>${token}</strong></p><p>El enlace y el código vencen en 30 minutos.</p>`
    );

    const result = { ...genericResult };
    if (process.env.NODE_ENV !== 'production') {
      result.resetUrl = resetUrl;
      result.token = token;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al procesar solicitud' });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body || {};
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const tokenClean = String(token || '').trim().toLowerCase();
    if (!tokenClean) {
      return res.status(400).json({ error: 'El código o token de recuperación es obligatorio' });
    }

    const accessToken = await prisma.tokenAcceso.findFirst({
      where: { tokenHash: hashToken(tokenClean), tipo: 'RECUPERACION_PASSWORD' },
    });

    if (!accessToken) {
      return res.status(400).json({ error: 'El enlace o código de recuperación es inválido' });
    }

    if (accessToken.usado) {
      return res.status(400).json({ error: 'Este enlace o código de recuperación ya fue utilizado' });
    }

    if (accessToken.expiraEn < new Date()) {
      return res.status(400).json({ error: 'El enlace o código ha expirado. Por favor, solicitá uno nuevo.' });
    }

    await prisma.$transaction([
      prisma.usuario.update({
        where: { id: accessToken.usuarioId },
        data: {
          passwordHash: await bcrypt.hash(password, 10),
          emailVerificado: true, // Proving email ownership activates the account
        },
      }),
      prisma.tokenAcceso.update({ where: { id: accessToken.id }, data: { usado: true } }),
    ]);

    res.json({ message: 'Contraseña actualizada con éxito. Ya podés iniciar sesión.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al restablecer contraseña' });
  }
}

module.exports = {
  login,
  register,
  resendVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
