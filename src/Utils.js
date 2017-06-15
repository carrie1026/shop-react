export const jumpWeChat = () => {
    window.location.href = window.location.href + '?code=2'
}

const RemWidth = 750
const TemplateWidth = 375

export const isValidPhoneNumber = (phoneNum) => {
  //rule http://baike.baidu.com/link?url=qgEGUgVR_H13S6ReCx9-RDzNSIjoIB2uqY-1BIaUtbKYq0pZHDDhgduxw2CbmwrJre6S7rhkkJOOHriubMnro_
  return phoneNum && phoneNum.toString().length == 11 && /1[3|4|5|7|8][0-9]\d{8}$/.test(phoneNum)
}

//需要将值改为rem的属性
const NeedUpdateRemProp = /width|height|margin|padding|border|top|left|right|bottom/

const px2rem = (v) => {
    const n = parseInt(v,10)
    const ret = isNaN(n) ? v : ( (n * RemWidth / TemplateWidth) / RemWidth * 20  + 'rem' )
    return ret
}
const NeedRenameProp = {
    autoplay: 'autoPlay'
}
const domStyles = window.document.createElement('div').style
const css3transform = /rotate|skew/ //目前只有 旋转 扭曲  //rotate(93deg) scale(0.35) skew(-106deg) translate(-83px);

const __Cache = new Map() //使用Map 缓存结果
//将attr转化为 样式和attributes
export const DateToElement = (attrs = {}) => {
    if(__Cache.has(attrs) == false){
        const attributes = {  }
        const style = { transform : [] }
        Object.entries(attrs).map(([key,val]) => {
            key = key.replace(/-\D/, $1 => $1.substr(1).toUpperCase())
            if(key in domStyles && key != 'src'){
                if(css3transform.test(key)){
                    style.transform.push(`${key}(${val}deg) `)
                }else{
                    if(NeedUpdateRemProp.test(key)){
                            val = (val + '').split(' ').map(v => px2rem(v)).join(' ')
                    }
                    if(key == 'backgroundImage'){
                        val = `url(${val})`
                    }
                    style[key] = val
                }
            }else{
                    key = NeedRenameProp[key] || key
                    attributes[key] = val
            }
        })
        style.transform = style.transform.join(' ')
         __Cache.set(attrs, { attributes, style })
    }else{
        //console.log('使用cache的数据', attrs, __Cache.get(attrs))
    }
    return __Cache.get(attrs)
        
}

//将数据中的attrs转为dom的 attributes
export const DataToDomAttrs = (data = {}) => {
    return DateToElement(data).attributes
}

//将自定义模版的attrs 转为样式
export const DataToStyles = (data = {}) => {
    return DateToElement(data).style
}

export const getPlayStatusFromTemplateData = (templateData) => {
    const audioIsPaused = {}
    if (templateData.children) {
        audioIsPaused.container = templateData.children && templateData.children.filter(v => v.type == 'audio' && v.attrs.autoplay == false).length
    }
    //每个page的背景音乐是否 不自动播放
    if (templateData.pages) {
        Object.entries(templateData.pages).forEach(([owner, { children }]) => {
            audioIsPaused[owner] = children && children.filter(v => v.type == 'audio' && v.attrs.autoplay == false).length
        })
    }
    return audioIsPaused
}