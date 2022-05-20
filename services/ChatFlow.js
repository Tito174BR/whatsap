import {textkeep, defaultans, defdef} from './Messages.js'

class ChatFlow{     //Guarda todo o fluxo
    constructor(){
        this.chatBlocks = []
        this.defdef = defdef
    }

    /**
     * @param {Object} bl
     */
    set fullBlocks(bl){         //Cria blocos a partir de um array
        bl.map((v, k)=> {v.regId = k;this.chatBlocks.push(v)})
    }

    //============= Funções de Localização =============//
    currentStep(arr){
        return this.chatBlocks[arr[0]].steps[arr[1]]
    }

    nextStep(arr, opt=0){
        return this.chatBlocks[arr[0]].steps[arr[1]].final?this.nextBlock(arr, opt).steps[0]:
            (this.chatBlocks[arr[0]].steps.reduce((acc, i) => {i.comesFrom==arr[1]?acc.push(i):null; return acc}, [])[opt])
    }

    lastStep(arr){
        let larr = this.lastStepId(arr)
        return this.chatBlocks[larr[0]].steps[larr[1]]
    }

    nextStepId(arr, opt){
        return this.currentStep(arr).final?[this.nextBlock(arr, opt).id, 0]:[arr[0], this.nextStep(arr, opt).id]
    }

    lastStepId(arr){
        let lastBlock = this.chatBlocks[this.chatBlocks[arr[0]].comesFrom]
        return arr[1]==0?[lastBlock.id, lastBlock.steps[lastBlock.steps.length-1].id]:
            [arr[0], this.currentStep(arr).comesFrom]
    }

    nextBlock(arr, opt=0){
        return this.chatBlocks.reduce((acc, i)=>{i.comesFrom==arr[0]?acc.push(i):null; return acc}, [])[opt]
    }
    //==================================================//
}

class ChatBlock{        //Blocos
    constructor(name, from){
        this.blockName = name
        this.comesFrom = from
        this.steps = []
    }

    /**
     * @param {Object} st
     */
    set fullSteps(st){      //Cria steps a partir de um array
        st.map((v, k)=> {v.regId = k; this.steps.push(v)})
    }

    set regId(id){
        this.id = id
    }
}

class ChatStep{             //Unidade mínima de conversação
    constructor(msg, fullfill, act, from, defans={}, final = false){
        this.msgs = msg
        this.fullfill = fullfill
        this.actions = act
        this.comesFrom = from
        this.defans = defans
        this.final = final
        this.isDataText = ['~nome~', '~cpf~', '~datanas~'].includes(this.fullfill[0])
    }

    set regId(id){
        this.id = id
    }
}

class Defans{
    constructor(tags, actions, txt){
        this.defs = {}
        tags.map((v, k)=>this.defs[v] = {act:(actions?actions[k]:null), msgs: txt[k]})
    }
}

//========================================================================================//
//============================== CRIAÇÃO DO OBJETO DE FLUXO ==============================//
//========================================================================================//

let chat = new ChatFlow()

//Blocos
chat.fullBlocks = [new ChatBlock('welcome', -1), 
    new ChatBlock('baseinfo', 0), 
    new ChatBlock('docs', 1), 
    new ChatBlock('cpf', 2), 
    new ChatBlock('ident', 2), 
    new ChatBlock('certidao', 2)]

//Steps
chat.chatBlocks[0].fullSteps = ([new ChatStep(textkeep.welcome, ['~sim~', 'matricula'], 'set-usertype-matricula',
    -1, new Defans(['~def~'], [null], defaultans.welcome).defs, true)])
chat.chatBlocks[1].fullSteps = ([
    new ChatStep(textkeep.baseinfo[0], ['~nome~'], 'set-data', -1, 
        new Defans(['~sim~', '~nao~', '~def~'], null, defaultans.baseinfo[0]).defs),
    new ChatStep(textkeep.baseinfo[1], ['~sim~'], 'validate-data', 0, 
        new Defans(['~nao~'], ['back'], defaultans.baseinfo[1][0]).defs), 
    new ChatStep(textkeep.baseinfo[2], ['~cpf~'], 'set-data', 1, 
        new Defans(['~sim~', '~num~', '~def~'], null, defaultans.baseinfo[2]).defs),
    new ChatStep(textkeep.baseinfo[3], ['~sim~'], 'validate-data', 2, 
        new Defans(['~nao~'], ['back'], defaultans.baseinfo[3][0]).defs),
    new ChatStep(textkeep.baseinfo[5], ['~sim~'], 'validate-data', 4, 
        new Defans(['~nao~'], ['back'], defaultans.baseinfo[5][0]).defs),
    new ChatStep(textkeep.baseinfo[6], ['~nop~'], '', 5, 
        new Defans(['~def~'], null, defaultans.baseinfo[6][0]).defs, true)])

//========================================================================================//
//========================================================================================//
//========================================================================================//

class ChatManager{  //Cada usuário contém uma instância do manager, para facilitar a movimentação no flow
    constructor(){
        this.id = [0, 0]
        this.refStep()
        this.data = ''
        this.dataType
    }

    refStep(){      //Atualiza o step atual de acordo com o id
        this.step = chat.currentStep(this.id)
    }

    goNext(){       //Avança para o próximo step
        this.id = chat.nextStepId(this.id)
        this.refStep()
    }

    goBack(){       //Retorna para o step anterior
        this.id = chat.lastStepId(this.id)
        this.refStep()
    }

    newMessage(msg, data, first=false){     //Chamado quando uma mensagem é recebida
        if(first)
            return {msg: this.step.msgs, act:''}
        let toDo = this.fullOrDef(msg)
        if(toDo == 'fullfill')
            return this.fullfillStuff(msg, data)
        if(/[~]\w+[~]/g.test(toDo))
            return this.onDefaultAns(toDo, data)
        return {msg: chat.defdef, act:''}
    }

    fullOrDef(msg){     //Define se a mensagem cumpre o fullfill ou algum defans
        if(this.step.fullfill.reduce((acc, i)=>{acc=msg.checkTags(i)?true:acc;return acc}, false))
            return 'fullfill'
        let defs = Object.keys(this.step.defans)
        let test = defs.map((i)=>msg.checkTags(i)).indexOf(true)
        if (test!=-1)
            return defs[test]
        return ''
    }

    fullfillStuff(msg, data){    //Ações para um step que foi fullfill
        let actions = this.fullActions(this.step.actions, msg)
        this.goNext()
        this.refStep()
        return {msg: this.replaceTags(this.step.msgs, data), act:actions, type:this.dataType}
    }

    onDefaultAns(tag, data){  //Ações para um step que foi default
        let stuff = {msg: this.replaceTags(this.step.defans[tag].msgs, data), act:''}
        if (this.step.defans[tag].act == 'back'){
            this.goBack()
            this.refStep()
        }
        return stuff
    }

    fullActions(actions, msg){   //Ações específicas
        switch(actions){
            case 'set-usertype-matricula':
                return actions
            case 'set-data':
                this.data = msg.data;
                this.dataType = this.step.fullfill[0]
                return ''
            case 'validate-data':
                return actions
        }
    }

    replaceTags(txt, datar){     //Reformata a string para conter a informação dada
        try{
            let tags = txt.reduce((acc, i) => 
                {let m = i.match(/[~]\w+[~]/g); acc.push(m?m:[]); return acc}, [])
            let keywords = tags.map((v)=>(v!=[])?
                (v.map((i)=>datar[i]?datar[i]:(i == this.dataType)?this.data:i)):[])
            return txt.map((v, k)=>{let x = v;tags[k]?
                (tags[k].map((i, j)=>x = x.replace(i, keywords[k][j]))):''; return x})
        } catch(err){
            return txt
        }
    }
}

export {chat, ChatManager}