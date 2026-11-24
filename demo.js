/* =====================================================================
   MODO DEMONSTRAÇÃO (igrejaunaspec.com/?demo)
   Mostra o app inteiro, com todas as abas, usando SÓ dados inventados.
   Nada é buscado nem gravado no banco de verdade: todo pedido ao banco
   é respondido aqui, por uma cópia de mentira que vive só nesta aba do
   navegador (some ao recarregar). Nomes, telefones e e-mails são fictícios.
===================================================================== */
(function(){
'use strict';

/* ---------- utilidades ---------- */
let seq = 0;
function uid(){
  seq++;
  const h = (n, t) => (n.toString(16) + '0'.repeat(t)).slice(0, t);
  return `de${h(seq, 6)}-0000-4000-8000-${h(seq * 7919, 12)}`;
}
const HOJE = new Date(); HOJE.setHours(0, 0, 0, 0);
function dia(n){ const d = new Date(HOJE); d.setDate(d.getDate() + n); return d; }
function iso(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function br(d, h){ return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear() + (h ? ' ' + h : ''); }
function quando(d, h, m){ const x = new Date(d); x.setHours(h, m || 0, 0, 0); return x.toISOString(); }
function antes(dias, h){ const x = dia(-dias); x.setHours(h || 10, 0, 0, 0); return x.toISOString(); }
// proximo dia da semana (0=domingo ... 6=sabado), a partir de hoje
function proximo(ds, semanasDepois){ const d = new Date(HOJE); d.setDate(d.getDate() + ((ds - d.getDay() + 7) % 7) + 7 * (semanasDepois || 0)); return d; }

/* ---------- pessoas (fictícias) ---------- */
const EU = 'de000000-0000-4000-8000-000000000001';
const P = {
  ana:    'de000000-0000-4000-8000-000000000002',
  bruno:  'de000000-0000-4000-8000-000000000003',
  carla:  'de000000-0000-4000-8000-000000000004',
  daniel: 'de000000-0000-4000-8000-000000000005',
  elisa:  'de000000-0000-4000-8000-000000000006',
  felipe: 'de000000-0000-4000-8000-000000000007',
  pastor: 'de000000-0000-4000-8000-000000000008',
};
const TODOS_ACESSOS = { admin:true, acesso_sexta:true, acesso_sabado:true, acesso_agenda:true, acesso_agendamentos:true,
  acesso_calendario:true, acesso_calendario_ver:false, acesso_escala:true, acesso_youtube:true, acesso_homiletico:true,
  ver_homiletico_calendario:true, acesso_pastoral:true, acesso_pastoral_secretaria:true, acesso_medicos:true,
  acesso_agenda_pessoal:true, acesso_comissao:true, acesso_passador:true };
function perfilFalso(id, nome, email, acessos, extra){
  const base = { id, nome, email, criado_em: antes(200), setores: [], tutorial_pendente: false,
    ultimo_acesso: antes(1, 9), ultima_aba_alterada: null, ultima_alteracao_em: null };
  Object.keys(TODOS_ACESSOS).forEach(k => base[k] = false);
  return Object.assign(base, acessos || {}, extra || {});
}
const perfis = [
  perfilFalso(EU, 'Visitante (demonstração)', 'visitante@exemplo.com', TODOS_ACESSOS, { setores:['Comunicação'] }),
  perfilFalso(P.ana, 'Ana Ribeiro', 'ana.ribeiro@exemplo.com', { acesso_sabado:true, acesso_sexta:true, acesso_escala:true }, { setores:['Comunicação'], ultima_aba_alterada:'Roteiros', ultima_alteracao_em: antes(2, 15) }),
  perfilFalso(P.bruno, 'Bruno Teixeira', 'bruno.teixeira@exemplo.com', { acesso_agendamentos:true, acesso_calendario:true }, { setores:['Secretaria'], ultima_aba_alterada:'Agendamentos', ultima_alteracao_em: antes(1, 11) }),
  perfilFalso(P.carla, 'Carla Monteiro', 'carla.monteiro@exemplo.com', { acesso_pastoral_secretaria:true, acesso_calendario:true }, { setores:['Secretaria'] }),
  perfilFalso(P.daniel, 'Daniel Fonseca', 'daniel.fonseca@exemplo.com', { acesso_calendario_ver:true }, { setores:['Conservação'] }),
  perfilFalso(P.elisa, 'Elisa Prado', 'elisa.prado@exemplo.com', { acesso_agenda:true, acesso_youtube:true }, { setores:['Comunicação'] }),
  perfilFalso(P.felipe, 'Felipe Nogueira', 'felipe.nogueira@exemplo.com', {}, { tutorial_pendente:true, ultimo_acesso:null }),
  perfilFalso(P.pastor, 'Pr. Marcos Exemplo', 'pastor.exemplo@exemplo.com', { acesso_pastoral:true, acesso_homiletico:true, acesso_agenda_pessoal:true }, { setores:['Pastores'] }),
];

/* ---------- roteiros ---------- */
function linhaSab(h, t, momento, part, obs, cor){ return { _id: 'r' + (++seq), horario:h, tempo:t, momento, participante:part || '', obs:obs || '', color:cor || '', gc:'', audio:'' }; }
const LED = '#C00000', MUS = '#0B5394', FAL = '#FFC000';
function roteiroSabado(titulo, pregador){
  return {
    title: titulo,
    rows: [
      linhaSab('10:55', '5 min', 'Contagem regressiva', 'Vídeo', 'SOM LED', LED),
      linhaSab('11:00', '5 min', 'Música instrumental', 'Grupo instrumental', 'Mics condenser', MUS),
      linhaSab('11:05', '1 min', 'Boas-vindas', 'Ana Ribeiro', 'MIC 01', FAL),
      linhaSab('11:06', '2 min', 'Intróito\nCanção de abertura', 'Equipe de Louvor', 'MIC 3 a 7', MUS),
      linhaSab('11:08', '2 min', 'Oração de invocação', 'Bruno Teixeira', 'MIC 01', FAL),
      linhaSab('11:10', '5 min', 'Adoração infantil', 'Ministério da Criança', 'MIC 02', FAL),
      linhaSab('11:15', '5 min', 'Momento pastoral\n• Vídeo de anúncios', 'Vídeo', 'SOM LED', LED),
      linhaSab('11:20', '4 min', 'Dízimos e ofertas', '', 'Mics condenser', MUS),
      linhaSab('11:24', '3 min', 'Louvor do momento de oração', 'Equipe de Louvor', 'MIC 3 a 7', MUS),
      linhaSab('11:27', '2 min', 'Oração pastoral (ajoelhados)', pregador, 'MIC 02', FAL),
      linhaSab('11:29', '5 min', 'Mensagem musical', 'Coral (exemplo)', 'Mics condenser', MUS),
      linhaSab('11:34', '10 min', 'Louvor (em pé)\n1. Primeira música\n2. Segunda música', 'Equipe de Louvor', 'MIC 3 a 7', MUS),
      linhaSab('11:44', '30 min', 'Mensagem bíblica', pregador, 'MIC 01', FAL),
      linhaSab('12:14', '5 min', 'Louvor final', 'Equipe de Louvor', 'MIC 3 a 7', MUS),
      linhaSab('12:19', '1 min', 'Oração final', pregador, 'MIC 01', FAL),
    ],
    notasEsquerda: 'Instrumental (louvor)\nPiano\nViolão\nBaixo\nBateria\n\nInput (sugestão)\n1 mic regente\n4 mics louvor\n4 mics condenser',
    notasDireita: 'Contatos (exemplo):\nProdução | Ana Ribeiro - (11) 90000-0001\nSom | Bruno Teixeira - (11) 90000-0002',
  };
}
function linhaSex(h, t, momento, obs, gc, audio){ return { _id: 'r' + (++seq), horario:h, tempo:t, momento, obs:obs || '', gc:gc || '', audio:audio || '', color:'' }; }
function roteiroSexta(titulo){
  return { title: titulo, rows: [
    linhaSex('19:55', '5 min', 'Vinheta de abertura', 'Telão com contagem', '', 'Trilha 01'),
    linhaSex('20:00', '10 min', 'Louvor', 'Letras no telão', 'Louvor', 'Banda'),
    linhaSex('20:10', '3 min', 'Oração inicial', '', 'Nome de quem ora', 'MIC 01'),
    linhaSex('20:13', '5 min', 'Avisos da semana', 'Vídeo de avisos', 'Avisos', 'Vídeo'),
    linhaSex('20:18', '30 min', 'Estudo bíblico', 'Slides do estudo', 'Tema do estudo', 'MIC 01'),
    linhaSex('20:48', '5 min', 'Louvor final e oração', '', '', 'Banda'),
  ]};
}
const pastaSab = uid(), pastaEventos = uid(), pastaSex = uid();
const pastas = [
  { id: pastaSab, culto:'sabado', nome:'Cultos de sábado', pasta_pai_id:null, aba:null, criado_em: antes(90) },
  { id: pastaEventos, culto:'sabado', nome:'Programações especiais', pasta_pai_id:null, aba:'eventos', criado_em: antes(80) },
  { id: pastaSex, culto:'sexta', nome:'Sextas deste mês', pasta_pai_id:null, aba:null, criado_em: antes(60) },
];
const sab1 = proximo(6), sab2 = proximo(6, 1), sexta1 = proximo(5);
function tituloSab(d, n){ return `CULTO DE SÁBADO | ${d.getDate()} DE ${d.toLocaleDateString('pt-BR', { month:'long' }).toUpperCase()} | ${n}º CULTO`; }
const roteiros = [
  { id: uid(), culto:'sabado', nome:'Sábado ' + br(sab1) + ' — 1º culto', titulo: tituloSab(sab1, 1), dados: roteiroSabado(tituloSab(sab1, 1), 'Pr. Marcos Exemplo'), publicado:true, atualizado_em: antes(0, 9), atualizado_por:'ana.ribeiro@exemplo.com', pasta_id: pastaSab },
  { id: uid(), culto:'sabado', nome:'Sábado ' + br(sab1) + ' — 2º culto', titulo: tituloSab(sab1, 2), dados: roteiroSabado(tituloSab(sab1, 2), 'Pr. Marcos Exemplo'), publicado:false, atualizado_em: antes(1, 16), atualizado_por:'ana.ribeiro@exemplo.com', pasta_id: pastaSab },
  { id: uid(), culto:'sabado', nome:'Sábado ' + br(sab2) + ' — 1º culto', titulo: tituloSab(sab2, 1), dados: roteiroSabado(tituloSab(sab2, 1), 'Pr. Convidado (exemplo)'), publicado:false, atualizado_em: antes(3, 10), atualizado_por:'visitante@exemplo.com', pasta_id: pastaSab },
  { id: uid(), culto:'sabado', nome:'Culto de Natal (exemplo)', titulo:'CULTO DE NATAL | PROGRAMAÇÃO ESPECIAL', dados: Object.assign(roteiroSabado('CULTO DE NATAL | PROGRAMAÇÃO ESPECIAL', 'Pr. Marcos Exemplo'), { aba:'eventos' }), publicado:false, atualizado_em: antes(5, 14), atualizado_por:'visitante@exemplo.com', pasta_id: pastaEventos },
  { id: uid(), culto:'sexta', nome:'Sexta ' + br(sexta1), titulo:'CULTO DE SEXTA | ' + br(sexta1), dados: roteiroSexta('CULTO DE SEXTA | ' + br(sexta1)), publicado:false, atualizado_em: antes(2, 20), atualizado_por:'ana.ribeiro@exemplo.com', pasta_id: pastaSex },
  { id: uid(), culto:'sexta', nome:'Sexta ' + br(dia(-2)), titulo:'CULTO DE SEXTA | ' + br(dia(-2)), dados: roteiroSexta('CULTO DE SEXTA | ' + br(dia(-2))), publicado:true, atualizado_em: antes(4, 19), atualizado_por:'ana.ribeiro@exemplo.com', pasta_id: pastaSex },
];
const compartilhamentos = [ { id: uid(), perfil_id: P.daniel, roteiro_id: roteiros[0].id, criado_em: antes(1) } ];
const roteiros_visitante = [
  { id: uid(), dono: P.felipe, nome:'Roteiro de teste do Felipe', titulo:'ENSAIO DO GRUPO JOVEM', dados: roteiroSabado('ENSAIO DO GRUPO JOVEM', 'Felipe Nogueira'), criado_em: antes(6), atualizado_em: antes(6), link_publico: null },
];

/* ---------- agendamentos (pedidos de uso da igreja / calendário) ---------- */
const T = { batismo:'tmv9j33yi', nave:'tmv9j4qe1', comissao:'tmv9j55yk', emprestimo:'tmv9j5xto', gravacao:'tmv9j6dm0', hall:'tmv9j7h6u', externo:'tmv9j80ua', reuniao:'tmv9j8tk2' };
function evento(nome, d, hIni, hFim, status, tipo, extra){
  return Object.assign({
    id: uid(), criado_em: antes(10), email:'responsavel@exemplo.com', nome_responsavel:'Responsável (exemplo)', contato:'(11) 90000-0000',
    nome_evento: nome, descricao:'Descrição de exemplo do evento.', quantidade_pessoas:'150',
    data_inicio: br(d, hIni), horarios_evento: hIni + ' às ' + hFim, data_entrada: hIni, data_saida: br(d, hFim),
    cenario_decoracao:'Não', observacoes:'', espacos_utilizados:'Auditório da Igreja', necessidades:'Som, Painel de LED',
    lista_equipamentos:'2 microfones sem fio', estrutura_externa:'Não', quem_opera:'Equipe da Igreja', montagem_forro:'Não',
    termo_enfermaria:'Sim, estou ciente.', termo_responsabilidade:'Concordo com o termo de responsabilidade.', assinatura:'Responsável (exemplo)',
    status, status_atualizado_em: status === 'Pendente' ? null : antes(3), status_atualizado_por: status === 'Pendente' ? null : 'bruno.teixeira@exemplo.com',
    confirmado_em: status === 'Agendado' ? antes(3) : null, origem:'app', ano_planilha:null, etiquetas: tipo ? ['tipo:' + tipo] : [],
    respostas_extra:{}, cor:null, recorrencia_grupo:null, recorrencia_freq:null, setores_visiveis:[]
  }, extra || {});
}
const ensaioGrupo = uid();
const agendamentos = [
  evento('Ensaio do coral', dia(1), '19:00', '21:00', 'Agendado', T.nave, { nome_responsavel:'Coral (exemplo)', recorrencia_grupo: ensaioGrupo, recorrencia_freq:'semanal' }),
  evento('Ensaio do coral', dia(8), '19:00', '21:00', 'Agendado', T.nave, { nome_responsavel:'Coral (exemplo)', recorrencia_grupo: ensaioGrupo, recorrencia_freq:'semanal' }),
  evento('Ensaio do coral', dia(15), '19:00', '21:00', 'Agendado', T.nave, { nome_responsavel:'Coral (exemplo)', recorrencia_grupo: ensaioGrupo, recorrencia_freq:'semanal' }),
  evento('Batismo', proximo(6), '16:00', '17:30', 'Agendado', T.batismo, { quantidade_pessoas:'300', necessidades:'Som, Painel de LED, Fotografia, Transmissão' }),
  evento('Reunião de líderes', dia(2), '20:00', '21:30', 'Agendado', T.reuniao, { espacos_utilizados:'Sala de reuniões', quantidade_pessoas:'25', necessidades:'Projetor' }),
  evento('Gravação de vídeo institucional', dia(3), '09:00', '12:00', 'Agendado', T.gravacao, { quem_opera:'Equipe Externa', necessidades:'Iluminação Cênica' }),
  evento('Casamento (exemplo)', dia(9), '17:00', '22:00', 'Agendado', T.externo, { quantidade_pessoas:'250', espacos_utilizados:'Auditório da Igreja, Hall da Igreja', cenario_decoracao:'Flores no altar e no corredor' }),
  evento('Concerto de Natal', dia(12), '19:30', '21:30', 'Agendado', T.nave, { quantidade_pessoas:'800', necessidades:'Som, Painel de LED, Iluminação Cênica, Fotografia, Transmissão' }),
  evento('Reunião da comissão', dia(5), '19:30', '21:00', 'Agendado', T.comissao, { espacos_utilizados:'Sala de reuniões', quantidade_pessoas:'15', necessidades:'' }),
  evento('Café com os novos membros', dia(6), '15:00', '17:00', 'Agendado', T.hall, { espacos_utilizados:'Hall da Igreja', quantidade_pessoas:'60' }),
  evento('Empréstimo de cadeiras', dia(4), '08:00', '18:00', 'Agendado', T.emprestimo, { espacos_utilizados:'Depósito', descricao:'Empréstimo de 50 cadeiras para evento da escola.' }),
  evento('Apresentação da escola (exemplo)', dia(11), '18:00', '21:00', 'Pendente', T.externo, { criado_em: antes(1), quantidade_pessoas:'600' }),
  evento('Ensaio extra da orquestra', dia(10), '15:00', '16:30', 'Pendente', T.nave, { criado_em: antes(0, 8), quem_opera:'Equipe Externa' }),
  evento('Seminário de família', dia(16), '19:00', '21:30', 'Pré-agendado (aguar. confirmação pastoral)', T.nave, { criado_em: antes(2) }),
  evento('Retiro de jovens (exemplo)', dia(20), '08:00', '18:00', 'Pendente', T.externo, { criado_em: antes(0, 10), espacos_utilizados:'Hall da Igreja' }),
  evento('Culto de gratidão', dia(-3), '10:00', '12:00', 'Concluído', T.nave),
  evento('Ensaio do coral', dia(-6), '19:00', '21:00', 'Agendado', T.nave, { nome_responsavel:'Coral (exemplo)', recorrencia_grupo: ensaioGrupo, recorrencia_freq:'semanal' }),
  evento('Ensaio do coral', dia(-13), '19:00', '21:00', 'Agendado', T.nave, { nome_responsavel:'Coral (exemplo)', recorrencia_grupo: ensaioGrupo, recorrencia_freq:'semanal' }),
  evento('Reunião de pais da escola', dia(-9), '19:30', '21:00', 'Agendado', T.hall, { espacos_utilizados:'Hall da Igreja', quantidade_pessoas:'120' }),
  evento('Gravação do coral jovem', dia(-11), '14:00', '17:00', 'Agendado', T.gravacao, { quem_opera:'Equipe da Igreja' }),
  evento('Batismo', dia(-17), '16:00', '17:30', 'Agendado', T.batismo),
  evento('Reunião de líderes', dia(-12), '20:00', '21:30', 'Agendado', T.reuniao, { espacos_utilizados:'Sala de reuniões' }),
  evento('Palestra sobre saúde', dia(-6), '19:00', '21:00', 'Concluído', T.hall),
  evento('Evento cancelado (exemplo)', dia(7), '14:00', '16:00', 'Cancelado', T.externo),
];

/* ---------- homilético (pregações) ---------- */
const homiletico = [];
for(let s = 0; s < 6; s++){
  const sb = proximo(6, s), sx = proximo(5, s);
  homiletico.push({ id: uid(), data: iso(sb), culto:'sabado', titulo: s % 2 ? 'O bom pastor' : 'Graça e esperança', pregador: s % 3 === 2 ? 'Pr. Convidado (exemplo)' : 'Pr. Marcos Exemplo', observacoes:'', status: s < 3 ? 'confirmado' : 'a_confirmar', link_youtube:null, atualizado_em: antes(5), atualizado_por:'pastor.exemplo@exemplo.com', nome_culto:null });
  if(s < 4) homiletico.push({ id: uid(), data: iso(sx), culto:'sexta', titulo:'Estudo da semana', pregador: s % 2 ? 'Ana Ribeiro' : 'Bruno Teixeira', observacoes:'', status: s < 2 ? 'confirmado' : 'a_confirmar', link_youtube:null, atualizado_em: antes(5), atualizado_por:'pastor.exemplo@exemplo.com', nome_culto:null });
}

/* ---------- agenda pastoral ---------- */
function compromisso(d, h, m, durMin, tipo, pessoa, local, status, dono, extra){
  const ini = new Date(d); ini.setHours(h, m || 0, 0, 0);
  const fim = new Date(ini.getTime() + durMin * 60000);
  return Object.assign({ id: uid(), inicio: ini.toISOString(), fim: fim.toISOString(), tipo, pessoa, contato:'(11) 90000-0000', local,
    endereco: local === 'Visita / endereço' ? 'Rua Exemplo, 123' : '', status, retorno_dias:null, grupo:null, atualizado_em: antes(1),
    atualizado_por:'carla.monteiro@exemplo.com', dono: dono || null, origem:'app', pedido:null, motivo:null }, extra || {});
}
const agenda_pastoral = [
  compromisso(dia(0), 9, 0, 60, 'espiritual', 'Membro A (exemplo)', 'Gabinete', 'confirmado'),
  compromisso(dia(0), 14, 30, 45, 'aconselhamento', 'Casal B (exemplo)', 'Gabinete', 'confirmado'),
  compromisso(dia(1), 10, 0, 90, 'reuniao', 'Reunião com a diretoria', 'Gabinete', 'confirmado'),
  compromisso(dia(1), 16, 0, 60, 'visita', 'Família C (exemplo)', 'Visita / endereço', 'pendente'),
  compromisso(dia(2), 8, 0, 120, 'bloqueio', '', 'Gabinete', 'confirmado'),
  compromisso(dia(2), 19, 0, 60, 'aconselhamento', 'Jovem D (exemplo)', 'Online', 'confirmado'),
  compromisso(dia(3), 11, 0, 60, 'espiritual', 'Membro E (exemplo)', 'Gabinete', 'pendente', null, { origem:'formulario' }),
  compromisso(dia(-1), 15, 0, 60, 'visita', 'Família F (exemplo)', 'Visita / endereço', 'realizado'),
  compromisso(dia(0), 13, 0, 60, 'reuniao', 'Planejamento da semana', 'Online', 'confirmado', EU),
  compromisso(dia(2), 9, 30, 60, 'reuniao', 'Reunião da equipe de mídia', 'Gabinete', 'confirmado', EU),
];
const agenda_pastoral_notas = [];
const pastoral_pedidos = [
  { id: uid(), criado_em: antes(0, 8), nome:'Pessoa interessada (exemplo)', contato:'(11) 90000-0003', tipo:'espiritual', inicio: quando(dia(4), 10), dur:60, local:'Gabinete', endereco:'', detalhes:'Gostaria de conversar com o pastor.', status:'novo', pastor:null, agenda_id:null, motivo:null, tratado_por:null, tratado_em:null },
  { id: uid(), criado_em: antes(1, 18), nome:'Família visitante (exemplo)', contato:'(11) 90000-0004', tipo:'visita', inicio: quando(dia(5), 16), dur:60, local:'Visita / endereço', endereco:'Rua Exemplo, 45', detalhes:'Pedido de visita.', status:'novo', pastor:null, agenda_id:null, motivo:null, tratado_por:null, tratado_em:null },
];
const pastoral_avisos = [
  { id: uid(), criado_em: antes(0, 9), agenda_id: agenda_pastoral[3].id, acao:'remarcado', pessoa:'Família C (exemplo)', contato:'(11) 90000-0000', inicio: agenda_pastoral[3].inicio, local:'Visita / endereço', motivo:'Pastor em viagem', feito_por:'Pr. Marcos Exemplo', lido:false },
];

/* ---------- escala de mídia ---------- */
const FUNCOES = [['camera_1','Câmera 1','🎥'],['camera_2','Câmera 2','🎥'],['camera_3','Câmera 3','🎥'],['camera_4','Câmera 4','🎥'],['grua','Grua','🏗️'],['gimbal','Gimbal','🎥'],['fotografia','Fotografia 1','📸'],['fotografia2','Fotografia 2','📸'],['direcao_video','Direção de Vídeo','📺'],['palco','Produção de Palco','🎭'],['telao','Operação de Telão','🖥️'],['audio','Operação de Áudio','🎤'],['transmissao','Transmissão','💻'],['direcao_de_programa','Direção de Programa','🎬'],['redes_sociais','Redes Sociais','📱']];
const escala_funcoes = FUNCOES.map(([chave, nome, emoji], i) => ({ id: uid(), chave, nome, emoji, posicao: i + 1, ativa:true, criado_em: antes(120) }));
const NOMES_VOL = ['Amanda Lopes','Beatriz Cardoso','Caio Martins','Débora Freitas','Eduardo Pires','Fernanda Alves','Gabriel Moura','Helena Duarte','Igor Batista','Júlia Ramos','Kevin Araújo','Larissa Campos','Mateus Vieira','Natália Rocha','Otávio Lima','Paula Mendes','Rafael Nunes','Sofia Barros','Thiago Castro','Vitória Gomes'];
const escala_voluntarios = NOMES_VOL.map((nome, i) => {
  const f = [FUNCOES[i % FUNCOES.length][0], FUNCOES[(i * 3 + 1) % FUNCOES.length][0]];
  return { id: uid(), nome, telefone:'(11) 9' + String(10000000 + i * 137).slice(0, 4) + '-' + String(1000 + i).slice(0, 4), email: nome.split(' ')[0].toLowerCase() + '@exemplo.com',
    frequencia: ['semanal','quinzenal','mensal'][i % 3], funcoes: [...new Set(f)], ultima_vez: iso(dia(-7 * (1 + i % 4))), ativo: i !== 19, criado_em: antes(150), reserva: i === 18 };
});
const escala_qualificacoes = [];
escala_voluntarios.forEach((v, i) => v.funcoes.forEach(f => escala_qualificacoes.push({ id: uid(), voluntario_id: v.id, funcao: f, nota: 3 + (i % 3), observacoes:'', atualizado_em: antes(30) })));
const escala_cultos = [], escala_culto_funcoes = [], escala_designacoes = [];
function cultoEscala(data, turno, nome, horario, preencher){
  const c = { id: uid(), data: iso(data), turno, criado_em: antes(20), nome: nome || null, horario: horario || null };
  escala_cultos.push(c);
  const lista = turno === 'extra' ? FUNCOES.slice(0, 6) : FUNCOES.slice(0, 13);
  lista.forEach(([chave], i) => {
    escala_culto_funcoes.push({ id: uid(), culto_id: c.id, funcao: chave, necessaria: true });
    if(i < preencher){
      const v = escala_voluntarios.find((x, k) => x.funcoes.includes(chave) && !escala_designacoes.some(d => d.culto_id === c.id && d.voluntario_id === x.id)) || escala_voluntarios[(i * 5) % 18];
      escala_designacoes.push({ id: uid(), culto_id: c.id, voluntario_id: v.id, funcao: chave, confirmado: i % 3 !== 2, criado_em: antes(5) });
    }
  });
  return c;
}
for(let s = -2; s < 4; s++){
  const d = proximo(6, s < 0 ? 0 : s); if(s < 0) d.setDate(d.getDate() + 7 * s);
  cultoEscala(d, 'primeiro_culto', null, null, s < 1 ? 13 : s === 1 ? 9 : 4);
  cultoEscala(d, 'segundo_culto', null, null, s < 1 ? 13 : s === 1 ? 7 : 2);
}
cultoEscala(proximo(6), 'extra', 'Culto JA', '19:00', 4);

/* ---------- pedidos de ajuste ---------- */
const pedidos_ajuste = [
  { id: uid(), criado_em: antes(2), atualizado_em: antes(1), autor: P.bruno, autor_nome:'Bruno Teixeira', aba:'Calendário', titulo:'Mostrar o responsável no calendário',
    detalhes:'Como funciona hoje:\nNo calendário aparece só o nome do evento.\n\nComo deveria ficar:\nAparecer também o nome do responsável embaixo do evento.', motivo:'Para saber com quem falar sem abrir o evento.', exemplo:'Ex.: "Ensaio do coral — Coral (exemplo)".', urgencia:'semana', link:'', status:'andamento', resposta:'Começamos a fazer.', prints:[] },
  { id: uid(), criado_em: antes(5), atualizado_em: antes(4), autor: P.ana, autor_nome:'Ana Ribeiro', aba:'Roteiros', titulo:'Imprimir roteiro em A4 deitado',
    detalhes:'Como funciona hoje:\nO roteiro imprime em pé.\n\nComo deveria ficar:\nOpção de imprimir deitado.', motivo:'Fica mais fácil de ler na mesa de som.', exemplo:'', urgencia:'esperar', link:'', status:'feito', resposta:'Pronto! Use o botão Imprimir.', prints:[] },
  { id: uid(), criado_em: antes(0, 9), atualizado_em: antes(0, 9), autor: P.elisa, autor_nome:'Elisa Prado', aba:'O app inteiro / outra coisa', titulo:'Modo escuro',
    detalhes:'Como funciona hoje:\nO app é só claro.\n\nComo deveria ficar:\nTer uma opção de tela escura.', motivo:'Na sala de transmissão a luz fica apagada.', exemplo:'', urgencia:'esperar', link:'', status:'novo', resposta:null, prints:[] },
];

/* ---------- artes (agenda da semana) ---------- */
const agendas = [
  { id: uid(), nome:'Agenda da semana (exemplo)', publicado:false, atualizado_em: antes(1), atualizado_por:'elisa.prado@exemplo.com', dados:{
    youtube:'youtube.com/@igrejaunasp', aviso:'Exemplo de aviso da semana', layout:{}, imagens:[],
    secoes:[
      { titulo:'Sexta', itens:[ { horario:'20h', titulo:'Culto de sexta', sub:'Estudo bíblico', cor:'', destaque:false } ] },
      { titulo:'Sábado', itens:[ { horario:'9h', titulo:'Escola Sabatina', sub:'', cor:'', destaque:false }, { horario:'11h', titulo:'Culto divino', sub:'Pr. Marcos Exemplo', cor:'', destaque:true }, { horario:'16h', titulo:'Batismo', sub:'', cor:'', destaque:false } ] },
    ] } },
];

/* ---------- tudo junto ---------- */
const TABELAS = { perfis, pastas, roteiros, compartilhamentos, roteiros_visitante, agendamentos, homiletico, agenda_pastoral,
  agenda_pastoral_notas, pastoral_pedidos, pastoral_avisos, escala_funcoes, escala_voluntarios, escala_qualificacoes,
  escala_cultos, escala_culto_funcoes, escala_designacoes, pedidos_ajuste, agendas,
  sorteio_telao: [ { id:'quartetos', estado:null, atualizado_em: antes(1) } ] };
const CHAVES = { homiletico:['data','culto'], agenda_pastoral_notas:['id'], sorteio_telao:['id'] };

/* ---------- filtros no estilo do banco (PostgREST), o básico ---------- */
function comparar(a, b){ if(a == null && b == null) return 0; if(a == null) return -1; if(b == null) return 1;
  if(typeof a === 'number' && typeof b === 'number') return a - b; return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0; }
function lista(txt){ return txt.replace(/^\(|\)$/g, '').split(',').map(s => s.replace(/^"|"$/g, '')); }
function confere(linha, col, expr){
  let neg = false;
  if(expr.startsWith('not.')){ neg = true; expr = expr.slice(4); }
  const p = expr.indexOf('.'); if(p < 0) return true;
  const op = expr.slice(0, p), val = decodeURIComponent(expr.slice(p + 1)), v = linha[col];
  let ok = true;
  if(op === 'eq') ok = String(v) === val;
  else if(op === 'neq') ok = String(v) !== val;
  else if(op === 'gt') ok = comparar(v, val) > 0;
  else if(op === 'gte') ok = comparar(v, val) >= 0;
  else if(op === 'lt') ok = comparar(v, val) < 0;
  else if(op === 'lte') ok = comparar(v, val) <= 0;
  else if(op === 'is') ok = val === 'null' ? v == null : String(v) === val;
  else if(op === 'in') ok = lista(val).includes(String(v));
  else if(op === 'like' || op === 'ilike'){ const re = new RegExp('^' + val.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', op === 'ilike' ? 'i' : ''); ok = re.test(String(v == null ? '' : v)); }
  else if(op === 'cs'){ const quer = lista(val.replace(/^\{|\}$/g, '')); ok = Array.isArray(v) && quer.every(q => v.map(String).includes(q)); }
  return neg ? !ok : ok;
}
function confereOu(linha, txt){
  // or=(a.eq.1,b.is.true)
  return lista(txt).some(parte => { const i = parte.indexOf('.'); return confere(linha, parte.slice(0, i), parte.slice(i + 1)); });
}
const ESPECIAIS = ['select','order','limit','offset','on_conflict','columns'];
function filtrar(linhas, params){
  let r = linhas.filter(l => {
    for(const [k, v] of params){
      if(ESPECIAIS.includes(k)) continue;
      if(k === 'or'){ if(!confereOu(l, v)) return false; continue; }
      if(!confere(l, k, v)) return false;
    }
    return true;
  });
  const ord = params.get('order');
  if(ord){
    const regras = ord.split(',').map(x => { const [c, dir] = x.split('.'); return { c, desc: dir === 'desc' }; });
    r = r.slice().sort((a, b) => { for(const g of regras){ const x = comparar(a[g.c], b[g.c]); if(x) return g.desc ? -x : x; } return 0; });
  }
  const lim = parseInt(params.get('limit'), 10); if(lim >= 0) r = r.slice(0, lim);
  return r;
}
const copia = o => JSON.parse(JSON.stringify(o));

/* ---------- respostas falsas ---------- */
let avisouSalvar = false;
function avisarSalvar(){
  if(avisouSalvar) return; avisouSalvar = true;
  try{ toast('Demonstração: as mudanças aparecem só nesta tela e não são salvas de verdade.', 'ok'); }catch(e){}
}
function resposta(dados, status){
  if(status === 204 || dados === undefined) return new Response(null, { status: 204 });
  return new Response(JSON.stringify(dados), { status: status || 200, headers: { 'Content-Type':'application/json' } });
}
const RPC = {
  ultimos_logins: () => perfis.map(p => ({ id: p.id, ultimo_login: p.ultimo_acesso })),
  calendario_descricao: () => null,
  marcar_tutorial_visto: () => null,
  registrar_atividade: () => null,
  pastoral_encaminhar: () => null,
};
async function tratarRest(url, init){
  const metodo = String((init && init.method) || 'GET').toUpperCase();
  const caminho = url.pathname.replace(/^\/rest\/v1\//, '');
  const params = url.searchParams;
  let corpo = null;
  if(init && init.body){ try{ corpo = JSON.parse(init.body); }catch(e){ corpo = null; } }
  const cab = new Headers((init && init.headers) || {});
  const minimo = /return=minimal/.test(cab.get('Prefer') || '');
  const umSo = /vnd\.pgrst\.object/.test(cab.get('Accept') || '');

  if(caminho.startsWith('rpc/')){
    const nome = caminho.slice(4);
    return resposta(RPC[nome] ? RPC[nome](corpo) : null);
  }
  const tabela = caminho.split('/')[0];
  if(tabela === 'formulario_schema' && metodo === 'GET') return null; // configuração pública do formulário: lê a de verdade
  if(tabela === 'formulario_schema'){ avisarSalvar(); return resposta(minimo ? undefined : [corpo], minimo ? 204 : 201); }
  const linhas = TABELAS[tabela] || (TABELAS[tabela] = []);

  if(metodo === 'GET' || metodo === 'HEAD'){
    const r = copia(filtrar(linhas, params));
    return resposta(umSo ? (r[0] || null) : r);
  }
  avisarSalvar();
  if(metodo === 'POST'){
    const novos = (Array.isArray(corpo) ? corpo : [corpo]).filter(Boolean);
    const chaves = params.get('on_conflict') ? params.get('on_conflict').split(',') : (CHAVES[tabela] || ['id']);
    const salvos = novos.map(n => {
      const achou = linhas.find(l => chaves.every(c => n[c] != null && String(l[c]) === String(n[c])));
      if(achou){ Object.assign(achou, n); return achou; }
      const l = Object.assign({ id: uid(), criado_em: new Date().toISOString() }, n);
      linhas.push(l); return l;
    });
    return resposta(minimo ? undefined : copia(salvos), minimo ? 204 : 201);
  }
  const alvo = filtrar(linhas, params);
  if(metodo === 'PATCH'){
    alvo.forEach(l => Object.assign(l, corpo || {}));
    return resposta(minimo ? undefined : copia(alvo), minimo ? 204 : 200);
  }
  if(metodo === 'DELETE'){
    alvo.forEach(l => { const i = linhas.indexOf(l); if(i >= 0) linhas.splice(i, 1); });
    return resposta(minimo ? undefined : copia(alvo), minimo ? 204 : 200);
  }
  return resposta([]);
}

/* ---------- guarda local só desta aba (não mexe no navegador de verdade) ---------- */
function instalarGuardaLocal(){
  const mem = {};
  // quartetos de exemplo para o sorteio
  const nomesQ = ['Cânticos Vocal','Karis','4 Music','Ministério Ecoar','Novo Canto','Reflexo','Quarteto Tessares','Acappela Bantu','Revive','Cantores do Rei'];
  const pessoas = ['Lucas','Pedro','Tiago','André','Mateus','Felipe','Tomé','Simão','Davi','Samuel','Elias','Jonas','Gideão','Caleb','Josué','Neemias','Daniel','Ezequiel','Isaías','Jeremias','Oséias','Amós','Joel','Abdias','Miquéias','Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias','Esdras','Boaz','Rúben','Levi','Judá','Aser','Gade','Dã','Naftali'];
  mem['sorteioQuartetos.v2'] = JSON.stringify(nomesQ.map((nome, i) => ({ nome, t1: pessoas[(i * 4) % 40] + ' (ex.)', t2: pessoas[(i * 4 + 1) % 40] + ' (ex.)', bar: pessoas[(i * 4 + 2) % 40] + ' (ex.)', bx: pessoas[(i * 4 + 3) % 40] + ' (ex.)' })));
  mem['viuComoUsar'] = '1';
  const guarda = {
    getItem: k => Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null,
    setItem: (k, v) => { mem[k] = String(v); },
    removeItem: k => { delete mem[k]; },
    clear: () => Object.keys(mem).forEach(k => delete mem[k]),
    key: i => Object.keys(mem)[i] || null,
    get length(){ return Object.keys(mem).length; },
  };
  try{ Object.defineProperty(window, 'localStorage', { configurable:true, get: () => guarda }); }catch(e){}
}

/* ---------- liga tudo ---------- */
function instalar(SUPABASE_URL, SUPABASE_KEY){
  DEMO.chave = SUPABASE_KEY;
  instalarGuardaLocal();
  const fetchReal = window.fetch.bind(window);
  const base = new URL(SUPABASE_URL);
  window.fetch = async function(entrada, init){
    let url;
    try{ url = new URL(typeof entrada === 'string' ? entrada : entrada.url, location.href); }catch(e){ return fetchReal(entrada, init); }
    if(url.host !== base.host) return fetchReal(entrada, init); // YouTube e outros sites: normal
    if(url.pathname.startsWith('/rest/v1/')){
      const r = await tratarRest(url, init);
      return r || fetchReal(entrada, Object.assign({}, init, { headers: Object.assign({}, (init && init.headers) || {}, { Authorization: 'Bearer ' + DEMO.chave }) }));
    }
    if(url.pathname.startsWith('/storage/v1/')) return resposta(url.pathname.includes('/sign/') ? [] : { Key:'demo' });
    if(url.pathname.startsWith('/auth/v1/signup')){ const id = uid(); return resposta({ id, user:{ id, email:'novo@exemplo.com' } }); }
    // login, senha, funções do servidor: nada sai daqui
    return resposta({});
  };
}

const DEMO = window.DEMO = { instalar, perfil: perfis[0], chave: '' };
})();
