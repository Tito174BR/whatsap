const textkeep = {}
const defaultans = {}
const defdef = ['Não reconheci o que você enviou.', 'Poderia responder minha pergunta anterior?']

//talkat = 0
textkeep.welcome = ['Olá! Sou um bot programado para auxiliar o processo de cadastro na pague',
    'Vejo que seu contato não está salvo no meu banco de dados.', 
    'Você gostaria de fazer seu cadastro']

defaultans.welcome = ['Caso queria realizar um novo cadastrp, basta me enviar um "sim" ou ' +
    '"Quero realizar um novo cadastro" a qualquer momento.']


//talkat = 1.0+
textkeep.baseinfo = [
    ['Tudo bem... Vou precisar de algumas informações suas agora.',                             //1.0
    'Primeiramente eu vou requisitando cada uma em ordem e você vai me enviando.',
    'Por favor, me informe o nome completo do aluno que fará a matrícula.'], 
    ['Seu nome completo é ~nome~.', 'Você confirma?'],                                          //1.1
    ['Certo, agora preciso do CPF do aluno.'], 
    ['O CPF é ~cpf~. Você confirma?'],                                                          //1.2
    ['Agora me informe a data de nascimento.', 'Só me enviar no formato dia/mes/ano'],          //1.3
    ['Sua data de nascimento é ~datanas~. Você confirma?'],                                     //1.4
    ['Tudo certo! O programa acaba aqui por enquanto.']]                                     

defaultans.baseinfo = [[['Ok! Só enviar o seu nome completo.'],                                 //1.0       
    ['Por favor, me envie o nome completo do aluno para que possamos prosseguir com o processo.'], 
    ['Você poderia rever o nome enviado?', 'Apesar de eu ter pedido o seu nome completo' +
    ', você me enviou apenas uma palavra.']], 
    [['Certo, você poderia me envia o nome correto agora?']],                                   //1.1
    [['Certo, Só me enviar o número do CPF.'], ['Eu preciso que você me envie o CPF ' + 
        'correto.', 'Ele deve conter exatamente 11 dígitos.'], ['Por favor me envie o CPF correto' +
        ' para que possamos prosseguir.']],                                                     //1.2
    [['Tudo bem, pode enviar o CPF correto agora?']],                                           //1.3
    [['Certo, só me enviar a data de nascimento.']],                                            //1.4
    [['Tudo bem, pode me enviar a data de nascimento correta agora?']],                         //1.5
    [['Não há mais respostas programadas atualmente.']],
]

//talkat = 2.0+
textkeep.docs = [['Tudo certo então!', 'Agora vou precisar de '+
    'alguns documentos, mas não precisa se preocupar caso não os tenha agora, você ' +
    'poderá enviá-los quando quiser, basta me falar qual você ' +
    'irá enviar a qualquer momento.', 'Esta é a lista de documentos que vou precisar:\n' + 
    '   > Identidade;\n   > Certidão de nascimento;\n   > Histórico escolar.', 
    'Você também pode me pedir para reenviar a lista a qualquer momento e eu também irei ' +
    'informar quais você já enviou e quais faltam enviar. Você pode até mesmo me pedir para ' +
    'te enviar um documento já entregue, para verificar se você me enviou o correto.', 
    'Quando quiser me enviar algum documento basta falar "gostaria de enviar a identidade", ' +
    'por exemplo, ou caso queira ver a lista de documentos ou um documento específico, só falar: ' +
    '"Gostaria de ver a lista de documentos"/"Gostaria de ver a identidade enviada".']]


//End
export {textkeep, defaultans, defdef}