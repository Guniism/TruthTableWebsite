let alp;
let tableData;

function calculateRPN(tokens) {
    let stack = [];

    // Helper functions for logical operators
    const applyOperator = (operator, operand1, operand2) => {
        switch (operator) {
            case "^": // AND
                return operand1 && operand2;
            case "v": // OR
                return operand1 || operand2;
            case "~": // NOT (Unary)
                return !operand1;
            case "->": // Implication (p -> q)
                return !operand1 || operand2;
            case "<->": // Biconditional (p <-> q)
                return operand1 === operand2;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    };

    for (let token of tokens) {
        if (["^", "v", "~", "->", "<->"].includes(token)) {
            // Apply operator: pop operands, compute, and push result
            if (token === "~") {
                // Unary operator (NOT)
                let operand1 = stack.pop();
                stack.push(applyOperator(token, operand1));
            } else {
                // Binary operators (AND, OR, Implication, Biconditional)
                let operand2 = stack.pop();
                let operand1 = stack.pop();
                stack.push(applyOperator(token, operand1, operand2));
            }
        } else {
            // Operand: push value onto stack
            stack.push(token);
        }
    }

    // The final result will be the only element left on the stack
    return stack.pop();
}



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
        const cellText = document.createTextNode(alp[i]);
        cell.appendChild(cellText);
        row.appendChild(cell);
    }
    thead.appendChild(row);

    for (let i = 0; i < tableData.length; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < n; j++) {
            const cell = document.createElement("td");
            const cellText = document.createTextNode(tableData[i][j]);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
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
    let vars = [];
    //let alphabet = new Set();
    alp = [];
    tableData = [];
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

            // if(isAlphabet(val[i+3])){
            //     vars.push("~" + val[i+3]);
            //     i += 3;
            // }
        }
        else if(val[i] == "!" || val[i] == "~"){
            // ~
            vars.push("~");
            // if(isAlphabet(val[i+3])){
            //     vars.push("~" + val[i+3]);
            //     i += 3;
            // }
        }
        else if(isAlphabet(val[i])){
            // Alphabet
            vars.push(val[i]);
            //alphabet.add(val[i]);
            if(!alp.includes(val[i])){
                alp.push(val[i]);
            }
        }
        else if(val[i] == " "){

        }
        else{
            console.log("Something is wrong");
            break;
        }
        
    }


    //console.log(vars);
    console.log(toRPN(vars)+" | "+alp);
    let size = alp.length;
    if(size > 0){
        genTable(size);
    }
    adjustFooter();
});


function precedence(op) {
    if (op === '~') return 4; // NOT (highest precedence for unary operator)
    if (op === '^') return 3; // AND
    if (op === 'v') return 2; // OR
    if (op === '<->') return 1; // Biconditional
    if (op === '->') return 0; // Implication
    return -1;
}
function isLeftAssociative(op) {
    return op !== '<->'; // Biconditional is the only non-left-associative operator
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
            stack.pop(); // Pop '(' from the stack
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
            output.push(token); // Operand (variable like a, b, etc.)
        }
    }
    // Pop all operators from the stack
    while (stack.length > 0) {
        output.push(stack.pop());
    }
    return output;
}

window.addEventListener('load', adjustFooter);
window.addEventListener('resize', adjustFooter);

function adjustFooter(){
    var pageHeight = document.documentElement.scrollHeight;
    var viewportHeight = window.innerHeight;
    console.log(pageHeight+" | "+viewportHeight); 
    const footer = document.getElementById("footer");

    if(pageHeight > viewportHeight){
        footer.style.position = 'relative';
    }
    else{
        footer.style.position = 'fixed';
    }


}



