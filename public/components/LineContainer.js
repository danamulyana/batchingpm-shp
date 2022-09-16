class LineContainer extends HTMLElement{
    constructor(){
        super();
    }

    set datas(datas){
        this._datas = datas;
        this.render();
    }

    render(){
        this.innerHTML = '';
        this._datas.forEach(data => {
            this.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h6>${data.title}</h6>
                    <div id="con-today-e">
                        
                    </div>
                </div>
            </div>`;
        })
    }
}

customElements.define('line-container',LineContainer);