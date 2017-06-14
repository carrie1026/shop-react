export const getUrlParameter = () => {
    //test
    // const urlSearch = '?p=OgEkA3dFWngXSEYgAyJONQhHFQN3VhMIaRpALgAeSR1jGXoSflYUFgQPDWM7dVgyJFEHQCACfQYPZBYgVyFnCzJUJBM7VG5hb29VP1U1TgkwZQFnBhFweBcUaG0SJEgzFVo5RBFFG3gXT0QTRXtxYzFRJkwiE0hLW3FQE0VtG3ltf2tRIQZCQXBWQCYTLnFje1g0XG9LA0AXAhYnFG5kFzBsJkoZMEVIHlBlHDZifwJ3RH92CRdGS0JRBAtRPlpuBEwzVzcAHAYZGl9tXWAecW0BPQN3VhUcDQ0GfF5kFHlxETQ&c=eyJ0ZW1wbGF0ZVVybCI6Imh0dHBzOi8vdGUtY2RuLnRjYy5zby9wcm9tb3Rpb24vMjg4Iiwic2VydmVyVXJsIjoiaHR0cHM6Ly90ZS1jb2RlLnRjYy5zby8iLCJ3ZWNoYXRKc0NvbmZpZ3VyZVVybCI6Imh0dHBzOi8vdGUtd2VjaGF0LnRjYy5zby93eGNvbmZpZy5qcyJ9'
    const urlSearch = window.location.search
    if (!urlSearch) return null

    let obj = {}
    urlSearch.substr(1).split('&').map((x) => {
        let temp = x.split('=')
        if (temp.length == 2) {
            obj[temp[0]] = temp[1]
        }
    })
    return obj
}

export const px2Number = (text) => {
    const number = text.substring(0, text.length - 2)
    return Number(number)
}


const MAX_WIDTH = 500
const MAX_HEIGHT = 500
export const uploadImg = (e, types, callback) => {
    let file = e.files ? e.files[0] : null
    if (file) {
        if (file.type && types.indexOf(file.type) === -1) {
            alert('文件类型不对')
            return
        }

        if (file.size > 0.3 * 1024 * 1024) {
            alert('文件太大了')
            return
        }

        var fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = (e) => {
            if (file.type.indexOf('image') > -1) {
                let img = new Image()
                img.src = e.target.result
                img.onload = () => {
                    let width = img.width
                    let height = img.height
                  
                    // var canvas = document.createElement('canvas')
                    // var ctx = canvas.getContext('2d')
                    // ctx.drawImage(img, 0, 0, width, height)
                    // var dataurl = canvas.toDataURL('image/png')
                    return callback(e.target.result,'',width,height)
                }
            } else {
                //有些（不靠谱的）游览器没有file type
                if (!file.type && types) {
                    let fileValidation = types.split(',').some((val) => {
                        return e.target.result.indexOf(val) > -1
                    })
                    if (!fileValidation) {
                        alert('文件类型不对')
                        return;
                    }
                }
                return callback(e.target.result)
            }
        }
    }
}

//处理 boxShadow
export const handleBoxShadow = (prepBoxShadowStyle,styleType,value) => {
        let shadowStyle = ''
        let shadowStyleArray = []
        shadowStyle = prepBoxShadowStyle ? prepBoxShadowStyle : 'transparent 0 0 0 0'
        shadowStyleArray = shadowStyle.split(' ')
        let arrayXY = []
        let arrayColor = []
        let arrayInset = []
        if(shadowStyleArray[shadowStyleArray.length-1] !== 'inset'){
            arrayXY = shadowStyleArray.slice(-4) 
            arrayColor = shadowStyleArray.slice(0,shadowStyleArray.length-4)
            arrayInset = []
        }else{
            arrayXY = shadowStyleArray.slice(shadowStyleArray.length-5,shadowStyleArray.length-1) 
            arrayColor = shadowStyleArray.slice(0,shadowStyleArray.length-5)
            arrayInset = shadowStyleArray.slice(-1)
        }

        switch(styleType){
            case 'boxShadowX' : 
                arrayXY[0] = `${value}px`
                break
            case 'boxShadowY' : 
                arrayXY[1] = `${value}px`
                break
            case 'boxShadowClarity' : 
                arrayXY[2] = `${value}px`
                break
            case 'boxShadowSize' : 
                arrayXY[3] = `${value}px`
                break
            case 'boxShadowColor' : 
                arrayColor = value.split(' ')
                break
            case 'boxShadowType' : 
                arrayInset[0] = value
                break
        }
        if(arrayInset[0] === ''){
            shadowStyle = arrayColor.concat(arrayXY).join(' ') 
        }else{
            shadowStyle = arrayColor.concat(arrayXY).concat(arrayInset).join(' ')
        }
        console.log(shadowStyle)
        return shadowStyle
    }

//处理 带'-'的style 
export const handleCSS = (style) => {
    if(style.includes('-')){
        let be = style.split('-')[1]
        let beArray = Array.from(be)
        beArray[0] = beArray[0].toUpperCase()
        return `${style.split('-')[0]}${beArray.join('')}`
    }else{
        return style
    }

}