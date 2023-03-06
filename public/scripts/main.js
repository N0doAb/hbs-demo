const docName = document.querySelector('#nameInput');
const textBlock = document.querySelector('#templateInput-content');
const variablesBlock = document.querySelector('#placeholderInput-content');
const textOutput = document.querySelector('#text-output');
// const searchText = document.querySelector('#searchInput');
const docContainer = document.querySelector('#docData-container');
const resetBtn = document.querySelector('#resetBtn');
const saveBtn = document.querySelector('#saveBtn');
const submitBtn = document.querySelector('#submitBtn');

displayDocs = () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (/^-?\d+$/.test(key[0])) {
            const newDoc = document.createElement('div');
            const docName = document.createElement('h2');
            const docText = document.createElement('p');
            const deleteBtn = document.createElement('p');

            docName.innerHTML = key.split('-')[1];
            docText.innerText = JSON.parse(localStorage.getItem(key)).text;
            deleteBtn.innerHTML = 'Delete';

            newDoc.setAttribute('data-id', key);
            newDoc.setAttribute('class', 'singleDoc');
            deleteBtn.setAttribute('id', 'deleteBtn');

            docContainer.appendChild(newDoc);
            newDoc.appendChild(docName);
            newDoc.appendChild(docText);
            newDoc.appendChild(deleteBtn);
        }
    }
}

setup = () => {
    displayDocs();
    reset();
    try {
        const docs = document.querySelectorAll('#docData-container p');
        const deleteBtn = document.querySelectorAll('#deleteBtn');

        docs.forEach(doc => {
            doc.addEventListener('click', (e) => {
                textBlock.value = JSON.parse(localStorage.getItem(e.target.parentElement.dataset.id)).text;
                variablesBlock.value = JSON.parse(localStorage.getItem(e.target.parentElement.dataset.id)).variables;
            })
        })

        deleteBtn.forEach(btn => {
            btn.addEventListener('click', (e) => {
                localStorage.removeItem(btn.parentElement.dataset.id);
                location.reload();
            });
        });
    } catch { console.log('No docs present.'); }
}

reset = () => {
    fetch('templates/varTemplate.json')
        .then(response => response.json())
            .then(data => variablesBlock.value = JSON.stringify(data, null, 4))
        .catch(err => console.log(err));
        
    fetch('templates/textTemplate.json')
        .then(response => response.json())
            .then(data => textBlock.value = data.text)
        .catch(err => console.log(err));
} 


result = () => {
    let data = textBlock.value;
    
    try {
        var variables = JSON.parse(variablesBlock.value)
    } catch { console.log('JSON err.'); }

    try {
        let RenderedData = Handlebars.compile(data)(variables);
        textOutput.innerHTML = RenderedData;
    } catch { console.log('Handlebars err.'); }
}

search = () => {
}

saveDoc = () => {
    if (!docName.value) { window.alert('No name specisfied.'); }
    else {
        const docData = {
            variables: variablesBlock.value,
            text: textBlock.value
        }
        localStorage.setItem(`${localStorage.length}-${docName.value}`, JSON.stringify(docData));
        location.reload()
    }
}

onload = setup();
textBlock.addEventListener('keyup', result)
variablesBlock.addEventListener('keyup', result)
resetBtn.addEventListener('click', reset);
saveBtn.addEventListener('click', saveDoc);
submitBtn.addEventListener('click', result);
//searchText.addEventListener('keyup', search);