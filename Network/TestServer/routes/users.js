var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) 
{
    console.log(req.query.name);
   
    //일반 ajax 요청일 경우
    if(req.query.name)
    {
        res.send('Hello~ ' + req.query.name);
    }

    //setData 일 경우
    else
    {
        var resData = 
        {
            email: 'test@gmail.com',
            age: 20
        };
    
        //json 형식의 데이터
        res.json(resData);   
        res.end();
    }
});

/*	
	var data = 
	{
		header: 
		{
			'packet_id': 100, 'query_name': 'ac0001'
		},

		body:
		{
			InBlock1:
			[
				{ 'login_id':'asoocool', 'login_pw': '1234' }
			]
		}
	};
*/
router.post('/', function(req, res, next) 
{
	res.header('Access-Control-Allow-Origin', '*');
  
	//클라이언트에서 보낸 post 데이터를 꺼내 json 으로 파싱한다.
	//data 의 구조는 위의 주석 참조
	var data = JSON.parse(req.body.data);

    console.log(data.body.InBlock1);

    //console.log(data.body.InBlock1[0].login_id);
    
	var resData = null;

    if(data.header.query_name=='ac001')
	{
		resData = 
		{
			//클라이언트에서 보낸 헤더값을 그대로 다시 응답데이터에 셋팅한다.
			header: 
			{
				packet_id: data.header.packet_id,
				query_name: data.header.query_name,
				error_code: 1000
			}, 
			body: 
			{
				//이곳은 전문에 따라 다르게 응답값을 셋팅해 준다.
				OutBlock1: 
				[
					{
						'nick_name': '아수쿨',
						'uid': 1234567,
						'email': 'asoocool@gmail.com'
					}
				]
			} 
		};
	}

	else if(data.header.query_name=='ac002')
	{
		resData = 
		{
			//클라이언트에서 보낸 헤더값을 그대로 다시 응답데이터에 셋팅한다.
			header: 
			{
				packet_id: data.header.packet_id,
				query_name: data.header.query_name,
				error_code: 1000
			}, 
			body: 
			{
				//이곳은 전문에 따라 다르게 응답값을 셋팅해 준다.
				OutBlock1: 
				[				
				]
			} 
		};

        //여러개의 데이터를 보내는 경우
		for(var i=0; i<5; i++)
		{
			resData.body.OutBlock1.push({
				'name': '홍길동'+i,
				'sex': 1,
				'age': 20000+i
			});
		}
	}
    
    else if(data.header.query_name=='ac003')
	{
		resData = 
		{
			//클라이언트에서 보낸 헤더값을 그대로 다시 응답데이터에 셋팅한다.
			header: 
			{
				packet_id: data.header.packet_id,
				query_name: data.header.query_name,
				error_code: 1000
			}, 
			body: 
			{
				//이곳은 전문에 따라 다르게 응답값을 셋팅해 준다.
				OutBlock1: 
				[
					{
						'output1': '아수쿨',
						'output2': 1234567
					}
				]
			} 
		};
	}    
	
	res.json(resData);	
	res.end();
});

module.exports = router;
