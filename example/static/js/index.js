(function () {
    let socketData = {
        isOpen: false
    };
    const socketUrl = "/";
    const socket = io.connect(socketUrl);

    socket.on('data', (data)=>{
        console.log(data);
        showResult(data);
    });

    const fileInput = document.getElementById('file-input');
    const docTypesSelect = document.getElementById('document-types-select');
    const submitButton = document.getElementById('submit-button');

    submitButton.addEventListener('click', uploadFile, false);

    function uploadFile() {
        resetResult();

        const file = fileInput.files[0];
        const docType = docTypesSelect.value;
        const docTypeName = docTypesSelect.children[docTypesSelect.selectedIndex].innerText

        if (!file || !docType) return;

        let formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', docType);
        formData.append('title', docTypeName);

        fetch('/api/upload/', {
            method: 'POST',
            //headers: {},
            body: formData
        }).then(
            response => response.json() // if the response is a JSON object
        ).then(success => () => {  // Handle the success response object
        }).catch(
            error => console.log(error) // Handle the error response object
        );
    }

    function showResult(data) {
        resetResult();

        let linkContainer = document.getElementById('result-edit-link');
        let button = document.createElement('button');
        let iframeCreated = false;
        button.addEventListener('click', () => {
            window.open(data.edit_link, "_blank");
        });
        button.innerHTML = 'Edit ...';
        linkContainer.appendChild(button);

        let answers = {};

        if (data && data.answers) {
            answers = data.answers;
        }

        let listContainer = document.getElementById('result-list');
        Object.keys(answers).forEach((key) => {
            let value = answers[key];
            let li = document.createElement('li');
            let keySpan = document.createElement('span');
            keySpan.innerHTML = value.name + ': ';

            let valueSpan = document.createElement('span');
            valueSpan.innerHTML = value.answer;

            li.appendChild(keySpan);
            li.appendChild(document.createElement('span'));
            li.appendChild(valueSpan);

            listContainer.appendChild(li);
        });
    }

    function resetResult() {
        document.getElementById('result-edit-link').innerHTML = '';
        document.getElementById('result-list').innerHTML = '';
    }
})();
