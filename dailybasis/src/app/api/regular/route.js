import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const form = await request.formData();
    const userId = parseInt(form.get('userId'));
    const isRegular = form.get('isRegular') === 'on' || form.get('isRegular') === 'true';

    await prisma.user.update({ where: { id: userId }, data: { isRegular } });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('regular API error', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET() {
  // Return a harmless 200 so prefetch/GET probes don't trigger 405.
  return new Response(JSON.stringify({ ok: true, message: 'GET received; use POST to update regular flag' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
