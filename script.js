let alp;
let alpMap;
let tableData;
let vars;
let formula;

function perm(n, sol, len) {
    if (len < n) {
        sol[len] = "T";
        perm(n,sol,len+1);

        sol[len] = "F";
        perm(n,sol,len+1);
    }
    else
    {
        tableData.push([...sol]);
    }
}

function genTable(n){
    let sol = new Array(n);
    let RPN = toRPN(vars);
    perm(n, sol, 0);
    // for(let i = 0; i < tableData.length; i++){
    //     console.log(tableData[i]);
    // }

    const table = document.createElement("table");
    table.id = "mainTable";
    const thead = document.createElement('thead');
    thead.id = "mainHead";
    const tbody = document.createElement('tbody');
    
    const row = document.createElement("tr");
    for (let i = 0; i < n; i++){
        const cell = document.createElement("td");
        if(i == 0){
            cell.style.borderTopLeftRadius = "7px";
        }
        const cellText = document.createTextNode(alp[i]);
        cell.style.paddingLeft = "20px";
        cell.style.paddingRight = "20px";
        cell.appendChild(cellText);
        row.appendChild(cell);
    }

    const cell = document.createElement("td");
    cell.style.borderTopRightRadius = "7px";
    cell.style.borderLeft = "1px solid #3B3B3C";
    cell.style.paddingLeft = "20px";
    cell.style.paddingRight = "20px";
    const cellText = document.createTextNode(formula);
    cell.appendChild(cellText);
    row.appendChild(cell);

    thead.appendChild(row);

    for (let i = 0; i < tableData.length; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < n; j++) {
            const cell = document.createElement("td");
            const cellText = document.createTextNode(tableData[i][j]);
            cell.appendChild(cellText);
            cell.style.borderTop = "1px solid #3B3B3C";
            row.appendChild(cell);
        }

        let rowCalculate = [];
        for(let j = 0; j < RPN.length; j++){
            if(isAlphabet(RPN[j]) && RPN[j] != "v"){
                if(tableData[i][alpMap.get(RPN[j])] == "T"){
                    rowCalculate.push(true);
                }
                else{
                    rowCalculate.push(false);
                }
            }
            else{
                rowCalculate.push(RPN[j]);
            }
        }
        const cell = document.createElement("td");
        const cellText = document.createTextNode((calculateRPN(rowCalculate)) ? "T" : "F");
        cell.style.borderLeft = "1px solid #3B3B3C";
        cell.style.borderTop = "1px solid #3B3B3C";
        cell.appendChild(cellText);
        row.appendChild(cell);
        
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    const mainArea = document.getElementById("mainArea");
    mainArea.appendChild(table);
    // table.setAttribute("border", "2");
}
function clearTable(){
    var table = document.getElementById("mainTable");
    if (table) {
        table.remove();
    }
}
function isAlphabet(char){
    const code = char.charCodeAt(0);
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}


const answer = document.getElementById("inp");
answer.addEventListener("input", function(){
    clearTable();
    vars = [];
    alp = [];
    alpMap = new Map();
    tableData = [];
    formula = "";
    let pos = 0;
    let val = answer.value + "    ";
    for (i = 0; i < val.length; i++){
        if(val[i] == "("){
            // (
            vars.push("(");
        }
        else if(val[i] == ")"){
            // )
            vars.push(")");
        }
        else if(val[i] == "^"){
            // /\
            vars.push("^");
        }
        else if(val[i] == "/" && val[i+1] == "\\"){
            // /\
            vars.push("^");
            i++;
        }
        else if(val[i] == "a" && val[i+1] == "n" && val[i+2] == "d"){
            // /\
            vars.push("^");
            i += 2;
        }
        else if(val[i] == "\\" && val[i+1] == "/"){
            // \/
            vars.push("v");
            i++;
        }
        else if(val[i] == "o" && val[i+1] == "r"){
            // \/
            vars.push("v");
            i++;
        }
        else if(val[i] == "-" && val[i+1] == ">"){
            // ->
            vars.push("->");
            i++;
        }
        else if(val[i] == "<" && val[i+1] == "-" && val[i+2] == ">"){
            // <->
            vars.push("<->");
            i += 2;
        }
        else if(val[i] == "n" && val[i+1] == "o" && val[i+2] == "t"){
            // ~
            vars.push("~");
            i += 2;
        }
        else if(val[i] == "!" || val[i] == "~"){
            // ~
            vars.push("~");
        }
        else if(isAlphabet(val[i])){
            // Alphabet
            vars.push(val[i]);
            if(!alp.includes(val[i])){
                alp.push(val[i]);
                alpMap.set(val[i], pos);
                pos++;
            }
            
        }
        else if(val[i] == " "){

        }
        else{
            console.log("Something is wrong");
            break;
        }
        
    }

    // console.log(vars);
    for(let i = 0; i < vars.length; i++){
        if(vars[i] == ")"){
            formula = formula.slice(0, -1);
            formula += vars[i] + " ";
        }
        else if(vars[i] == "~"){
            formula += vars[i];
        }
        else if(i === vars.length-1 || vars[i] == "("){
            formula += vars[i];
        }
        else{
            formula += vars[i] + " ";
        }
    }
    //console.log(toRPN(vars)+" | "+alp);
    let size = alp.length;
    if(size > 0){
        genTable(size);
    }
    adjustFooter();
    //console.log(alpMap);
});


function precedence(op) {
    if (op === '~') return 4;
    if (op === '^') return 3;
    if (op === 'v') return 2; 
    if (op === '<->') return 1;
    if (op === '->') return 0;
    return -1;
}
function isLeftAssociative(op) {
    return op !== '<->';
}
function toRPN(tokens) {
    let output = [];
    let stack = [];

    for(let i = 0; i < tokens.length; i++){
        let token = tokens[i];

        if(token === '('){
            stack.push(token);
        }
        else if(token === ')')
        {
            while(stack.length > 0 && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop(); // pop (
        }
        else if(['^', 'v', '<->', '->', '~'].includes(token))
        {
            while(stack.length > 0 && stack[stack.length - 1] !== '(' &&
                    (precedence(stack[stack.length - 1]) > precedence(token) || 
                    (precedence(stack[stack.length - 1]) === precedence(token) && isLeftAssociative(token)))){
                output.push(stack.pop());
            }
            stack.push(token);
        }
        else
        {
            output.push(token); //var
        }
    }
    while (stack.length > 0) {
        output.push(stack.pop());
    }
    return output;
}


function calculateRPN(tokens) {
    let stack = [];

    const applyOperator = (operator, operand1, operand2) => {
        switch (operator) {
            case "^": // and
                return operand1 && operand2;
            case "v": // or
                return operand1 || operand2;
            case "~": // not
                return !operand1;
            case "->": // imply
                return !operand1 || operand2;
            case "<->": // equiv
                return operand1 === operand2;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    };

    for (let token of tokens) {
        if (["^", "v", "~", "->", "<->"].includes(token)) {
            if (token === "~") {
                let operand1 = stack.pop();
                stack.push(applyOperator(token, operand1));
            } else {
                let operand2 = stack.pop();
                let operand1 = stack.pop();
                stack.push(applyOperator(token, operand1, operand2));
            }
        } else {
            stack.push(token);
        }
    }

    return stack.pop();
}


window.addEventListener('load', adjustFooter);
window.addEventListener('resize', adjustFooter);
function adjustFooter(){
    var pageHeight = document.documentElement.scrollHeight;
    var viewportHeight = window.innerHeight;
    const footer = document.getElementById("footer");

    if(pageHeight > viewportHeight){
        footer.style.position = 'relative';
    }
    else{
        footer.style.position = 'fixed';
    }


}



