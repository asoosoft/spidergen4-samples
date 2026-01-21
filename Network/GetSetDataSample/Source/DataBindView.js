
class DataBindView extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

        //바인더는 전역에 1개만 만들어도 되고, 화면마다 별도로 만들어도 된다.
		this.binder = new DataBinder();

	}

	onInitDone()
	{
		super.onInitDone()

        //특정 키와 컴포넌트를 매칭한 오브젝트를 넘긴다.
        this.model = this.binder.getModel({
		    'name': this.nameTxt,
		    'age': this.ageTxt,
		    'city': this.cityTxt,
            'group': this.groupView
	    });


        /*
        다음과 같이 같은 키값으로 다른 컴포넌트를 등록해서 모델을 얻을 수 있음.
        this.model2 = this.binder.getModel({
		    'name': this.nameTxt2,
		    'age': this.ageTxt2,
		    'city': this.cityTxt2,
	    });

        이런 경우 다음과 같이 다중 get, set 이 가능함
        this.binder.broadcastSet('name', 'asoosoft')
        this.binder.broadcastGet('name')
        */

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		

	}

    //모델의 키값으로 특정 컴포넌트의 값을 읽거나 쓴다.
    //내부적으로는 getData(), setData() 를 호출한다.
    //NormalView 참고

	onReadClick(comp, info, e)
	{
        const txt = `${this.model.name}, ${this.model.age}, ${this.model.city}`
        this.txtArea.appendText(txt+'\r\n')

		console.log(txt)
	}

	onWriteClick(comp, info, e)
	{
		this.model.name = 'asoocool'
        this.model.age = 50
        this.model.city = 'seoul'
	}

	onReadViewClick(comp, info, e)
	{
        const txt = JSON.stringify(this.model.group)
        
        this.txtArea.appendText(txt+'\r\n')

        console.log(this.model.group)

	}

	onWriteViewClick(comp, info, e)
	{
		this.model.group = { city: 'seoul', age: '50', name: 'asoocool'}
	}
}

