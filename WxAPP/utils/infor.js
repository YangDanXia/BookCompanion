module.exports={"BookType":[
{"tag":"马克思","title":"A 马列主义、毛泽东思想、邓小平理论"},
{"tag":"哲学","title":"B 哲学、宗教"},
{"tag":"社会","title":"C 社会科学总论"},
{"tag":"政治","title":"D 政治、法律"},
{"tag":"军事","title":"E 军事"},
{"tag":"经济","title":"F 经济"},
{"tag":"教育","title":"G 文化、科学、教育、体育"},
{"tag":"语言","title":"H 语言、文字"},
{"tag":"文学","title":"I 文学"},
{"tag":"艺术","title":"J 艺术"},
{"tag":"历史","title":"K 历史、地理"},
{"tag":"自然","title":"N 自然科学总论"},
{"tag":"数学","title":"O 数理科学和化学"},
{"tag":"天文","title":"P 天文学、地球科学"},
{"tag":"生物","title":"Q 生物科学"},
{"tag":"医药","title":"R 医药、卫生"},
{"tag":"农业","title":"S 农业科学"},
{"tag":"工业技术","title":"T 工业技术"},
{"tag":"交通","title":"U 交通运输"},
{"tag":"航天","title":"V 航天、航空"},
{"tag":"科学","title":"X 环境科学、安全科学"},
{"tag":"小说","title":"Z 综合性图书"}],
"OptionShow":["disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree","disagree"],
  "BookNavigationUp": [
    { "url": 'functions/bookNavigateList?tag=艺术', "img": "../../img/icon/art.png", "text": '艺术' }, 
    { "url": 'functions/bookNavigateList?tag=历史', "img": "../../img/icon/history.png", "text": "历史" }, 
    { "url": 'functions/bookNavigateList?tag=职场', "img": "../../img/icon/economy.png", "text": '职场' }, 
    { "url": 'functions/bookNavigateList?tag=军事', "img": "../../img/icon/war.png", "text": '军事' }],
   "BookNavigationDown": [
     { "url": 'functions/bookNavigateList?tag=文学', "img": "../../img/icon/literature.png", "text": '文学' }, 
     { "url": 'functions/bookNavigateList?tag=卫生', "img": "../../img/icon/medical.png", "text": '医学' }, 
     { "url": 'functions/bookNavigateList?tag=哲学', "img": "../../img/icon/philosophy.png", "text": '哲学' }, 
     { "url": 'functions/bookNavigateList?tag=综合',"img": "../../img/icon/more.png","text": '更多'}],
   "BookAction":[{"bindtap":"relevant","name":"相关书","src":"../../img/icon/same.png"},{"bindtap":"bookOfLibrary","name":"馆藏情况","src":"../../img/icon/comment.png"},{"bindtap":"addShelf","name":"收藏此书","src":"../../img/icon/read.png"},{"bindtap":"booking","name":"预约此书","src":"../../img/icon/add.png"}],"ReminderFunction":[{"title":"允许推荐书籍","warn":"开启后，默认每日一推;可关闭后再开启，选择推荐频率"},{"title":"书籍到期提醒","warn":"开启后，在借阅书籍到期前一周会给您推送提醒还书"},{"title":"藏书到馆提醒","warn":"开启后，当预约图书到馆，会给您推送提醒"},{"title":"预约到期提醒","warn":"开启后，在预约期限前一星期，会给您推送提醒取书"}]
}