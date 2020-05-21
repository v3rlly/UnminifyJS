try
{
    const btn = document.querySelector('.btn');
    const icon = document.querySelector('button > span > i');
    const desc = document.querySelector('button > span.text');
    const cardHeader = document.querySelector('div.card-header');
    const txtAreaResult = document.querySelector('div.card-header > div.form-group > textarea');

    var tab = undefined;

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>
    {
        tab = tabs[0];
        
        if(tab.url.split('.js').length < 2)
        {
            btn.setAttribute("disabled", "disabled");
            desc.innerText = 'unsupported page';
        }
    });




    // animation
    const animation =
    {
        make(icon,desc)
        {
            icon.classList.remove("fa-box-open");
            icon.classList.add("fa-spinner");
            icon.classList.add("fa-pulse");

            icon.classList.add("disabled");

            desc.innerText = 'Loading..';
        },
        revert(icon,desc)
        {
            icon.classList.remove("fa-spinner");
            icon.classList.remove("fa-pulse");
            icon.classList.add("fa-box-open");

            icon.classList.remove("disabled");

            desc.innerText = 'Unpack';
        }
    }



    btn.addEventListener('click', async function(e) {

        animation.make(icon, desc);

        const {url} = tab;

        const data = await fetch(`https://cors-anywhere.herokuapp.com/${url}`).then(resp => resp.text());

        const parsed = prettier.format(data, {
            parser: "babel",
            plugins: prettierPlugins,
            printWidth: 240,
            tabWidth: 4,
        });

        await setTimeout( async ()=> {

            await animation.revert(icon, desc);
            
            cardHeader.style.display = 'block';
            txtAreaResult.value = parsed;
            txtAreaResult.focus();
            txtAreaResult.select();
        }, 2000);

    });
}
catch (error)
{
    console.log(error);

    alert(`an error has occurred. update the page and try again. if the error persists, please leave your feedback here https://github.com/pabloverlly/UnminifyJS/issues`);
}