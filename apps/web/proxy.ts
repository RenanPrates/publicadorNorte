// Senha única da equipe (fase 1, sem login). Os sites publicados não passam por aqui: ficam no GitHub Pages.
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  // arquivos de mídia pelo sha (40 caracteres impossíveis de adivinhar): a prévia roda isolada e não envia a senha
  if (req.method === 'GET' && /^\/api\/arquivos\/[0-9a-f]{40}$/.test(req.nextUrl.pathname)) return NextResponse.next();
  const senha = process.env.SENHA_EQUIPE;
  if (!senha) {
    // sem senha configurada, só abre no próprio computador
    const host = req.headers.get('host') || '';
    if (/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)) return NextResponse.next();
    return new NextResponse('Configure SENHA_EQUIPE para abrir o publicador fora deste computador.', { status: 503 });
  }
  const auth = req.headers.get('authorization') || '';
  const [tipo, valor] = auth.split(' ');
  if (tipo === 'Basic' && valor) {
    const [, s] = atob(valor).split(/:(.*)/s);
    if (s === senha) return NextResponse.next();
  }
  return new NextResponse('Senha da equipe necessária.', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Publicador Norte", charset="UTF-8"' } });
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
