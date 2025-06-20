import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { collaboratorId: string } }
) {
  const { collaboratorId } = params;

  try {
    // Primeiro, encontramos o colaborador para obter o userId associado
    const collaborator = await prisma.collaborator.findUnique({
      where: { id: collaboratorId },
      select: { userId: true },
    });

    if (!collaborator) {
      return NextResponse.json({ message: 'Colaborador não encontrado' }, { status: 404 });
    }

    // Usamos uma transação para garantir que ambas as operações sejam concluídas
    await prisma.$transaction([
      // 1. Deletar o registro do Colaborador
      prisma.collaborator.delete({
        where: { id: collaboratorId },
      }),
      // 2. Deletar o registro do Usuário associado
      prisma.user.delete({
        where: { id: collaborator.userId },
      }),
    ]);

    return NextResponse.json({ message: 'Colaborador excluído com sucesso' }, { status: 200 });

  } catch (error) {
    console.error('Falha ao excluir colaborador:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
} 