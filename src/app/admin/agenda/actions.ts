"use server";

import { createClient } from "@/utils/supabase/server";

export async function searchStudents(query: string) {
  const supabase = await createClient();

  let request = supabase
    .from("profiles")
    .select("id, full_name, email")
    .order("full_name", { ascending: true })
    .limit(50);

  if (query.trim()) {
    request = request.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data, error } = await request;

  if (error) {
    console.error("Error searching students:", error);
  }

  const results = data || [];

  // INSERINDO USUÁRIOS DE TESTE APENAS PARA VALIDAÇÃO DA UI
  const testUsers = [
    { id: 'test-1', full_name: '[TESTE] Carlos Almeida', email: 'carlos.teste@example.com' },
    { id: 'test-2', full_name: '[TESTE] Amanda Costa', email: 'amanda.teste@example.com' },
    { id: 'test-3', full_name: '[TESTE] Roberto Silva', email: 'roberto.teste@example.com' },
    { id: 'test-4', full_name: '[TESTE] Juliana Mendes', email: 'juliana.teste@example.com' },
    { id: 'test-5', full_name: '[TESTE] Felipe Rocha', email: 'felipe.teste@example.com' },
  ];

  const allUsers = [...testUsers, ...results];

  if (query.trim()) {
    return allUsers.filter(u => 
      u.full_name.toLowerCase().includes(query.toLowerCase()) || 
      (u.email && u.email.toLowerCase().includes(query.toLowerCase()))
    );
  }

  return allUsers;
}
