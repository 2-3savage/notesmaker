export const pages = [
    {
        id: 1, 
        title: 'SibFu', 
        type: 'board', 
        icon: null, 
        cover: 1, 
        tags: [{text: "документация", color: "green_muted"}, {text: "бэкенд", color: "green_muted"}, {text: "фронтенд", color: "green_muted"}],
        items: [
            {id: 1, position: 1, title: 'Бэклог проекта 123123', 
            table: [
                {title: '412312312312', comment: "", datepicker: null, tag: []},
                {title: '5', comment: "", datepicker: {date: Date(), complete: false}, tag: [{text: "документация", color: "green_muted"}, {text: "бэкенд", color: "green_muted"}]}, 
                {title: '6', comment: "", datepicker: {date: Date(), complete: false}, tag: [{text: "документация", color: "green_muted"}]}
            ]
            }, 
            {id: 2, position: 2, title: 'Бэклог спринта', 
            table: [
                {title: '4', comment: "123", datepicker: null, tag: [{text: "фронтенд", color: "green_muted"}]}, 
                {title: '5', comment: "", datepicker: {date: Date(), complete: true}, tag: [{text: "бэкенд", color: "green_muted"}, {text: "фронтенд", color: "green_muted"}]}, 
                {title: '6', comment: "", datepicker: null, tag: []}
            ]
            }, 
            {id: 3, position: 3, title: 'Бэклог привет 2', 
            table: [
                {title: '4', comment: "456", datepicker: {date: Date(), complete: true} , tag: [{text: "документация", color: "green_muted"}, {text: "бэкенд", color: "green_muted"}]},
                {title: '599', comment: "", datepicker: null, tag: [{text: "фронтенд", color: "green_muted"}, {text: "документация", color: "green_muted"}]}, 
                {title: '6', comment: "", datepicker: {date: Date(), complete: false}, tag: [{text: "фронтенд", color: "green_muted"},{text: "документация", color: "green_muted"}, {text: "бэкенд", color: "green_muted"}]}]}, 
        ]
    }, 
    {
        id: 2, 
        title: 'SFU', 
        type: 'table', 
        icon: '123',    
        cover: null, 
        comment: 'sfu govno', 
        headers: [{id: 1, title: 'name'}, {id: 2, title: 'tags'}, {id: 3, title: 'content'}],
        items: [
            {
                id: 1, 
                content: [{text: 'Воекном'}, {text: 'Воекном'}, {text: 'Воекном'},]
            },
            {
                id: 2, 
                content: [{text: 'Воекном'}, {text: 'Воекном'}, {text: 'Воекном'},]
            },
            {
                id: 3, 
                content: [{text: 'Воекном'}, {text: 'Воекном'}, {text: 'Воекном'},]
            },
            
        ]
    }, 
]
[
    {
        "id": 23,
        "position": 1,
        "title": "Название доски",
        "table": [
            {
                "title": "123",
                "comment": "123",
                "datepicker": {
                    "date": "2024-01-27T11:55:06Z",
                    "complete": false
                },
                "tag": [
                    {
                        "text": "Привяу",
                        "color": "yellow"
                    }
                ]
            }
        ]
    }
]
  