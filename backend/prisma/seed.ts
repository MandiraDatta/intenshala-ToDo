import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create or find Admin / Demo user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'mandira@example.com' },
    update: {},
    create: {
      email: 'mandira@example.com',
      passwordHash: hashedPassword,
      fullName: 'Mandira Datta',
      username: 'mandira',
      title: 'Project Lead & Admin',
      theme: 'dark',
      colorMode: 'emerald',
    },
  });

  // Additional members
  const member1 = await prisma.user.upsert({
    where: { email: 'ankit@example.com' },
    update: {},
    create: {
      email: 'ankit@example.com',
      passwordHash: hashedPassword,
      fullName: 'Ankit Datta',
      username: 'ankit',
      title: 'Full Stack Engineer',
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: 'pooja@example.com' },
    update: {},
    create: {
      email: 'pooja@example.com',
      passwordHash: hashedPassword,
      fullName: 'Pooja Shree',
      username: 'pooja',
      title: 'UI/UX Designer',
    },
  });

  // 2. Create Workspace
  let workspace = await prisma.workspace.findFirst({
    where: { slug: 'default-workspace' },
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: "Mandira's Workspace",
        slug: 'default-workspace',
      },
    });
  }

  // 3. Create Workspace Memberships
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: { role: 'OWNER' },
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'OWNER',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: member1.id,
      },
    },
    update: { role: 'MEMBER' },
    create: {
      workspaceId: workspace.id,
      userId: member1.id,
      role: 'MEMBER',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: member2.id,
      },
    },
    update: { role: 'MEMBER' },
    create: {
      workspaceId: workspace.id,
      userId: member2.id,
      role: 'MEMBER',
    },
  });

  // 4. Create Sample Project
  let project = await prisma.project.findFirst({
    where: { workspaceId: workspace.id },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        workspaceId: workspace.id,
        createdById: user.id,
        name: 'Kanban Application',
        description: 'Hierarchical Task Management & Kanban System',
      },
    });
  }

  // 5. Create Parent Tasks with Subtasks
  const parentTask1 = await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      projectId: project.id,
      createdById: user.id,
      reporterId: user.id,
      title: 'Implement Subtask Hierarchy & Cascading Delete',
      description: 'Full backend and frontend dynamic integration for parent-child subtasks.',
      status: 'DOING',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 86400000 * 3),
      members: {
        create: [
          { userId: user.id },
          { userId: member1.id },
        ],
      },
    },
  });

  // Subtasks
  await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      projectId: project.id,
      parentId: parentTask1.id,
      createdById: user.id,
      reporterId: user.id,
      title: 'Update Prisma Schema for parentId Self-Relation',
      status: 'COMPLETED',
      priority: 'HIGH',
    },
  });

  await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      projectId: project.id,
      parentId: parentTask1.id,
      createdById: user.id,
      reporterId: user.id,
      title: 'Bind Subtask Interactive Checkboxes & Progress Bar',
      status: 'DOING',
      priority: 'MEDIUM',
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
