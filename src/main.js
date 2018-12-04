let eventController = {
    $signInForm: $("#signIn-form"),
    $signUpForm: $("#signUp-form"),
    $signUpBtn: $("#signUp-submit"),
    $signInBtn: $("#signIn-submit"),
    form_status: "0", //0:sign in ; 1: sign up
    init() {
        this.userInit();
        this.btnEvents();
        this.submitEvents();
    },
    userInit() {
        if (document.cookie) {
            console.log('has cookie');
            console.log(document.cookie.split("=")[0] === "sign_in_name");
            if (document.cookie.split("=")[0] === "sign_in_name") {
                $(".head-toggle1").show();
                $(".head-toggle2").hide();
                $("#myForm").hide();
                let audio = $("<audio loop autoplay></audio>");
                audio.attr("src", "./src/dj.mp3")
                $("body").append(audio)
                $("#spark").css("animation", "spark .1s infinite");
            }
        } else {
            $(".head-toggle1").hide();
            $(".head-toggle2").show();
            $("#spark").css("animation", "")
        }
    },
    submitEvents() {
        // sign up
        this.$signUpBtn.on("click", (e) => {
            let need = ['name', "pass", "confirmPass"];
            let hash = {};
            let status = {
                error: false,
                text: ""
            };
            for (let key in need) {
                hash[need[key]] = this.$signUpForm.find(`[name=${need[key]}]`).val();
                if (!hash[need[key]]) {
                    status["error"] = true;
                    status["text"] = "Please enter your name or password!";
                    break;
                }
            }
            if (hash["pass"] != hash["confirmPass"]) {
                status["error"] = true;
                status["text"] = "Your password mismatch!";
            }
            console.log(hash);
            $("#signUp-error").text(status["text"])
            if (!status["error"]) {
                $.post("/sign_up", hash)
                    .then((res) => {
                        if (res.status === 'success') {
                            alert('Successful registration, please login!');
                            $(`#tab-1`).prop("checked", true).siblings('.tab').prop(
                                "checked",
                                false);
                        }
                    }, (err) => {
                        console.log('sign up error');
                        if (err.responseJSON.status === 'repeat') {
                            $("#signUp-error").text(
                                "The user already exists, please go to login!")
                        }
                    })
            }
        })
        // sign in
        this.$signInBtn.on("click", (e) => {
            let need = ['name', "pass"];
            let hash = {};
            let status = {
                error: false,
                text: ""
            };
            for (let key in need) {
                hash[need[key]] = this.$signInForm.find(`[name=${need[key]}]`).val();
                if (!hash[need[key]]) {
                    status["error"] = true;
                    status["text"] = "Please enter your name or password!"
                    break;
                }
            }
            $("#signIn-error").text(status["text"])
            if (!status["error"]) {
                $.post("/sign_in", hash)
                    .then((res) => {
                        console.log(res);
                        if (res.status === 'success') {
                            console.log('login in success');
                            location.reload();
                        }
                    }, (err) => {
                        console.log('login in fail');
                        if (err.responseJSON.status === 'fail') {
                            $("#signIn-error").text(
                                "Incorrect user name or password!")
                        }
                    })
            }
        })

    },
    btnEvents() {
        $(btnLogin).on('click', () => {
            this.form_status = 0;
            this.change_sign_status(this.form_status);
        })
        $(btnReg).on('click', () => {
            this.form_status = 1;
            this.change_sign_status(this.form_status);
        })
        $(`.tab-sign`).on('click', (e) => {
            e.stopPropagation()
            this.form_status = 0;
            this.change_sign_status(this.form_status);
        })
        $(`.tab-reg`).on('click', (e) => {
            e.stopPropagation()
            this.form_status = 1;
            this.change_sign_status(this.form_status);
        })
    },
    closeForm() {
        $(myForm).on("click", (e) => {
            e.stopPropagation();
        })
        setTimeout(() => {
            $(document).one("click", () => {
                $(myForm).hide();
            })
        }, 0);
    },
    change_sign_status(status) {
        $(myForm).show();
        this.closeForm();
        if (status === 0) {
            console.log('show sign in');
            $(`#tab-1`).prop("checked", true).siblings('.tab').prop("checked", false);
        } else if (status === 1) {
            console.log('show sign up');
            $(`#tab-2`).prop("checked", true)
        }
    }
};
eventController.init();