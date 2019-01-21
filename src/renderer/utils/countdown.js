export function countdown(that, isdisabled, sendText) {
    that.isdisabled = true;
    var num = 60;
    var timer = setInterval(() => {
        num--;
        that[sendText] = num + "秒后重新获取";
        if (num <= 0) {
            that.isdisabled = false;
            that[sendText] = "获取验证码";
            clearInterval(timer);
        }
    }, 1000);
}



