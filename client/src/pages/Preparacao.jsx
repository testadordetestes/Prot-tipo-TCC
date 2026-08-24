function Preparacao() {
  return (
    <div className="pagina-placeholder">
      <h1>Preparação</h1>
      <p>Conteúdo orientativo sobre currículo e redação — sem geração automática, só dicas práticas pra você aplicar.</p>

      <section className="preparacao-secao">
        <h2>Como montar seu currículo</h2>
        <ol>
          <li><strong>Dados pessoais:</strong> nome completo, cidade, telefone e e-mail (evite apelidos ou e-mails informais demais).</li>
          <li><strong>Objetivo:</strong> uma frase curta dizendo qual vaga ou área você busca.</li>
          <li><strong>Formação:</strong> escola atual, curso técnico e cursos extras que você já fez.</li>
          <li><strong>Experiências:</strong> mesmo sem emprego formal, projetos escolares, trabalho voluntário, estágios e monitorias contam.</li>
          <li><strong>Habilidades:</strong> liste ferramentas, idiomas e competências que você realmente domina.</li>
          <li><strong>Formatação:</strong> mantenha em 1 página, fonte legível, sem erros de português, e adapte pra cada vaga.</li>
        </ol>
      </section>

      <section className="preparacao-secao">
        <h2>Modelo de referência</h2>
        <div className="curriculo-modelo">
          <p><strong>[Seu nome completo]</strong></p>
          <p>Cidade, UF · telefone · e-mail</p>
          <p><strong>Objetivo:</strong> [ex: vaga de aprendiz na área de Tecnologia]</p>
          <p><strong>Formação</strong></p>
          <p>[Curso/escola] — [período]</p>
          <p><strong>Experiências</strong></p>
          <p>[Projeto/atividade] — [breve descrição do que você fez]</p>
          <p><strong>Habilidades</strong></p>
          <p>[Ferramentas, idiomas, competências]</p>
        </div>
      </section>

      <section className="preparacao-secao">
        <h2>Como escrever uma boa redação</h2>
        <ol>
          <li><strong>Introdução:</strong> apresente o tema e sua tese (o ponto de vista que você vai defender).</li>
          <li><strong>Desenvolvimento:</strong> use 2 parágrafos, cada um com um argumento diferente sustentando sua tese, com exemplos ou repertório (dados, fatos, referências).</li>
          <li><strong>Conclusão:</strong> retome a tese e proponha uma solução prática pro problema discutido.</li>
          <li><strong>Revisão:</strong> releia buscando erros de português, repetição de palavras e clareza das ideias.</li>
        </ol>
      </section>
    </div>
  )
}

export default Preparacao
