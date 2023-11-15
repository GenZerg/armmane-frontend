class ARMMane{
    constructor(address = "localhost", port = "8000", protocol = "http", serverList = []) {
        // If url have ?elementor-preview
        if (window.location.href.indexOf("?elementor-preview") != -1) {
            // Exit
            this.consoleLog("「ARMMANE」 Development mode is enabled, Script will not run", "WARN");
            return;
        }
        if (serverList.length == 0) {
            serverList = [
                    {
                        "name": "Nicezki Pi (For Dev)",
                        "address": "pi.nicezki.com",
                        "port": "",
                        "protocol": "https"
                    },
                    {
                        "name": "Nicezki HTTPS (Deprecated)",
                        "address": "miri.network.nicezki.com",
                        "port": "5000",
                        "protocol": "https"
                    },
                    {
                        "name": "Local Server",
                        "address": "localhost",
                        "port": "8000",
                        "protocol": "http"
                    },
                ];
        }

        this.audio = null;

        this.armStatus = {
            "status" : "none",
        }

        this.seriStatus = {
            "status" : "none",
        }

        this.statusAlert = {
            "status" : "none",
        }

        this.appStatus = {
            "connected" : false,
            "isDisconnecting" : false,
            "serverList" : serverList,
            "server" : {
                "fullURL" : protocol + "://" + address + (port ? ":" + port : ""),
                "address" : address,
                "port" : port,
                "protocol" : protocol,
            },
            "soundDomain" : "https://design.nicezki.com/dev/sound/",
            "soundState" : true,
            "lastSoundPlay" : "",
            "lastArmStatusMode" : -1,
            "lastArmStatusSortingMode" : -1,
            "lastDropBoxPosition" : -1,
            "lastArmStep" : -1,
            "currentEditCodeBlock" : null,
            "currentScreen" : "screen_connect",
            "commandMode" : false,
            "manualControl" : false, // Trigger whwn manual control is active in 10 last second
            "manualControlTrigger" : null, // Store the timeout function
            "sensorWarningTrigger" : null, // Store the timeout function
            "manualBoxControlTrigger" : null, // Store the timeout function
            "manualBoxControl" : null, // Store the timeout function    
            
        }

        this.elements = {
            "mode" : ["btn", "form", "ui", "screen", "template","text","icon"],
            "screen" : {
                "errorloading" : this.querySel(".scr-errload"),
                "loading" : this.querySel(".scr-loading"),
                "connect" : this.querySel(".scr-connect"),
                "main" : this.querySel(".scr-main"),
            },
            "ui" : {
                "statusarea" : this.querySel(".main-statusarea"),
                "controlarea" : this.querySel(".main-controlarea"),
                "settingarea" : this.querySel(".main-settingarea"),
                "statusbox" : this.querySel(".main-statusbox"),
                "controlbox" : this.querySel(".main-controlbox"),
                "cconfbox" : this.querySel(".cconfbox"),
                "logmane" : this.querySel(".logmane"),
                "log_disconnect" : this.querySel(".log-disconnect"),
                "log_area" : this.querySel(".log-area"),
                "log_disconnect" : this.querySel(".log-disconnect"),
                "box_serverlist" : this.querySel(".box-serverlist"),
                "status_inf_trigger" : this.querySel(".status-inf-triggered"),
                "status_inf_trigger_alt" : this.querySel(".status-inf-triggered-alt"),
                "status_inf_idle" : this.querySel(".status-inf-idle"),
                "status_inf_idle_alt" : this.querySel(".status-inf-idle-alt"),
                "status_conv00_forward" : this.querySel(".status-conv00-fw"),
                "status_conv00_backward" : this.querySel(".status-conv00-bw"),
                "status_conv00_stop" : this.querySel(".status-conv00-stop"),
                "status_conv01_stop" : this.querySel(".status-conv01-stop"),
                "status_conv01_forward" : this.querySel(".status-conv01-fw"),
                "status_conv01_backward" : this.querySel(".status-conv01-bw"),
                "command_area" : document.querySelectorAll(".ins-command-area"),
                "function_box" : document.querySelectorAll(".ins-func-box"),
                "preset_box1" : document.querySelectorAll(".ins-preset-box-1"),
                "preset_box2" : document.querySelectorAll(".ins-preset-box-2"),
                "livepreview" : this.querySel(".livepreview"),
                "livepreview_test" : this.querySel(".livepreview-test"),
                "settingbox1" : this.querySel(".settingbox-1"),
                "settingbox2" : this.querySel(".settingbox-2"),
                "settingbox3" : this.querySel(".settingbox-3"),
                "settingbox4" : this.querySel(".settingbox-4"),
                "log_progress" : this.querySel(".log-progress"),
                "empty_step" : this.querySel(".empty-step"),
                "pred_box" : this.querySel(".pred-box"),
                "pred_box_alt" : this.querySel(".pred-box-alt"),
                "box_step_1" : this.querySel(".box-step-1"),
                "box_step_2" : this.querySel(".box-step-2"),
                "box_step_3" : this.querySel(".box-step-3"),
                "box_step_4" : this.querySel(".box-step-4"),
                "box_step_5" : this.querySel(".box-step-5"),
                "alert_shuffle" : this.querySel(".alert-shuffle"),
                "alert_missgrip" : this.querySel(".alert-missgrip"),
                "alert_missingobj" : this.querySel(".alert-missingobj"),
                "alert_norecobj" : this.querySel(".alert-norecobj"),
                "alert_norecobjlim" : this.querySel(".alert-norecobjlim"),
                "alert_nogripcheck" : this.querySel(".alert-nogripcheck"),
                "alert_gripfaillim" : this.querySel(".alert-gripfaillim"),
                "alert_noard" : this.querySel(".alert-noard"),
                "alert_wintec" : this.querySel(".alert-wintec"),
                "alert_nosen" : this.querySel(".alert-nosen"),
                "alert_emergencyactivated" : this.querySel(".alert-emergencyactivated"),
                "alert_sendmessagefail" : this.querySel(".alert-sendmessagefail"),
                "alert_highcpuuse" : this.querySel(".alert-highcpuuse"),
                "alert_highmemuse" : this.querySel(".alert-highmemuse"),
                "alert_highdiskuse" : this.querySel(".alert-highdiskuse"),
                "alert_nocam" : this.querySel(".alert-nocam"),
                "alert_nomodel" : this.querySel(".alert-nomodel"),
                "info_os" : this.querySel(".info-os"),
                "info_version" : this.querySel(".info-version"),
                "info_release" : this.querySel(".info-release"),
                "info_machine" : this.querySel(".info-machine"),
                "info_processor" : this.querySel(".info-processor"),
                "info_python_version" : this.querySel(".info-python-version"),
                "info_cpu_usage" : this.querySel(".info-cpu-usage"),
                "info_memory_usage" : this.querySel(".info-memory-usage"),
                "info_disk_usage" : this.querySel(".info-disk-usage"),
                "box_status_a" : this.querySel(".box-status-a"),
                "box_status_b" : this.querySel(".box-status-b"),
                "box_status_c" : this.querySel(".box-status-c"),
                "status_cam_savepower" : this.querySel(".status-cam-savepower"),
                "status_cam_enable" : this.querySel(".status-cam-enable"),
                "status_cam_disable" : this.querySel(".status-cam-disable"),
                "status_predict_on" : this.querySel(".status-predict-on"),
                "status_predict_off" : this.querySel(".status-predict-off"),
                "test_sensor_result" : this.querySel(".test-sensor-result"),
                "test_grip_result" : this.querySel(".test-grip-result"),
                "ui_test_step_1" : this.querySel(".ui-test-step-1"),
                "ui_test_step_2" : this.querySel(".ui-test-step-2"),
                "ui_test_step_3" : this.querySel(".ui-test-step-3"),
            },
            "btn" : {
                "conn_connectsrv" : this.querySel(".btn-connectsrv"),
                "status_toggle" : this.querySel(".btn-status-toggle"),
                "main_info" : this.querySel(".btn-main-info"),
                "main_control" : this.querySel(".btn-main-control"),
                "main_config" : this.querySel(".btn-main-config"),
                "error_btn_selectserver" : this.querySel(".err-btn1"),
                "error_btn_retry" : this.querySel(".err-btn2"),
                "cconf_btn_save" : this.querySel(".cconf-btn-save"),
                "cconf_btn_cancel" : this.querySel(".cconf-btn-cancel"),
                "main_auto" : this.querySel(".btn-main-auto"),
                "main_mode" : this.querySel(".btn-main-mode"),
                "emergency" : this.querySel(".btn-emergency-toggle"),
                "test_servo_0" : this.querySel(".btn-test-servo0"),
                "test_servo_1" : this.querySel(".btn-test-servo1"),
                "test_servo_2" : this.querySel(".btn-test-servo2"),
                "test_servo_3" : this.querySel(".btn-test-servo3"),
                "test_servo_4" : this.querySel(".btn-test-servo4"),
                "test_servo_5" : this.querySel(".btn-test-servo5"),
                "test_conv_0" : this.querySel(".btn-test-conv0"),
                "test_conv_1" : this.querySel(".btn-test-conv1"),
                "camera_refresh" : this.querySel(".btn-model-refresh"),
                "camera_refresh_alt" : this.querySel(".btn-model-refresh-alt"),
                "model_refresh" : this.querySel(".btn-camera-refresh"),
                "model_refresh_alt" : this.querySel(".btn-camera-refresh-alt"),
                "setup_step_2" : this.querySel(".btn-setup-step-2"),
                "setup_step_3" : this.querySel(".btn-setup-step-3"),
            },
            "form" : {
                "conn_address_field" : this.querySel("#form-field-srvaddress"),
                "servo_00" : this.querySel("#form-field-s0"),
                "servo_01" : this.querySel("#form-field-s1"),
                "servo_02" : this.querySel("#form-field-s2"),
                "servo_03" : this.querySel("#form-field-s3"),
                "servo_04" : this.querySel("#form-field-s4"),
                "servo_05" : this.querySel("#form-field-s5"),
                "conv_00" : this.querySel("#form-field-conv0"),
                "conv_01" : this.querySel("#form-field-conv1"),
                "cconf_01" : this.querySel("#form-field-cconf-s1"),
                "cconf_02" : this.querySel("#form-field-cconf-s2"),
                "cconf_03" : this.querySel("#form-field-cconf-s3"),
                "cconf_04" : this.querySel("#form-field-cconf-s4"),
                "box_1" : this.querySel("#form-field-box-a"),
                "box_1_alt" : this.querySel("#form-field-box-a-alt"),
                "box_2" : this.querySel("#form-field-box-b"),
                "box_2_alt" : this.querySel("#form-field-box-b-alt"),
                "box_3" : this.querySel("#form-field-box-c"),
                "box_3_alt" : this.querySel("#form-field-box-c-alt"),
                "cconf_sound" : this.querySel("#form-field-soundstate"),
                "camera_list" : this.querySel("#form-field-camlist"),
                "camera_list_alt" : this.querySel("#form-field-camlist-alt"),
                "model_list" : this.querySel("#form-field-modellist"),
                "model_list_alt" : this.querySel("#form-field-modellist-alt"),
            },
            "template" : {
                "btn_serverlist" : this.querySel(".tp-btn-server"),
                "log_alert" : this.querySel(".tp-log-alert"),
                "ins_function" : document.querySelectorAll(".tp-ins-func"),
                "code_block" : this.querySel(".tp-ins-code-block"),
                "ins_preset1" : document.querySelectorAll(".tp-ins-preset-1"),
                "ins_preset2" : document.querySelectorAll(".tp-ins-preset-2"),
            },
            "text" : {
                "connect_url" : this.querySel(".connecting-url").querySelector("div > h2"),
                "connect_status" : this.querySel(".connecting-status").querySelector("div > h2"),
                "cconf_title_1" : this.querySel(".cconf-title-1").querySelector("div > h2"),
                "cconf_title_2" : this.querySel(".cconf-title-2").querySelector("div > h2"),
                "cconf_title_3" : this.querySel(".cconf-title-3").querySelector("div > h2"),
                "cconf_title_4" : this.querySel(".cconf-title-4").querySelector("div > h2"),
                "prediction_class" : this.querySel(".pred-class").querySelector("div > h2"),
                "prediction_class_alt" : this.querySel(".pred-class-alt").querySelector("div > h2"),
                "prediction_confident" : this.querySel(".pred-confident").querySelector("div > h2"),
                "prediction_confident_alt" : this.querySel(".pred-confident-alt").querySelector("div > h2"),
                "log_title" : this.querySel(".log-title").querySelector("div > h2"),
                "log_subtitle" : this.querySel(".log-subtitle").querySelector("div > h5"),
                "log-number" : this.querySel(".log-number").querySelector("div > h1"),
                "main_auto_title" : this.querySel(".btn-main-auto").querySelector("span"),
                "main_mode_title" : this.querySel(".btn-main-mode").querySelector("span"),
                "emergency_title" : this.querySel(".btn-emergency-toggle").querySelectorAll("span")[2],
                "info_os_title" : this.querySel(".info-os").querySelector("h4"),
                "info_version_title" : this.querySel(".info-version").querySelector("h4"),
                "info_release_title" : this.querySel(".info-release").querySelector("h4"),
                "info_machine_title" : this.querySel(".info-machine").querySelector("h4"),
                "info_processor_title" : this.querySel(".info-processor").querySelector("h4"),
                "info_python_version_title" : this.querySel(".info-python-version").querySelector("h4"),
                "info_cpu_usage_title" : this.querySel(".info-cpu-usage").querySelectorAll("span")[2],
                "info_memory_usage_title" : this.querySel(".info-memory-usage").querySelectorAll("span")[2],
                "info_disk_usage_title" : this.querySel(".info-disk-usage").querySelectorAll("span")[2],
                "test_sensor_result_title" : this.querySel(".test-sensor-result").querySelector("h4"),
                "test_grip_result_title" : this.querySel(".test-grip-result").querySelector("h4"),
            },
            "icon" : {
                "log_icon" : this.querySel(".log-icon").querySelector("div > i"),
                "pred_icon" : this.querySel(".pred-icon").querySelector("div > i"),
                "pred_icon_alt" : this.querySel(".pred-icon-alt").querySelector("div > i"),
            }
        }

        this.conf_list = [
            {
                "type" : "servo",
                "value" : 0,
                "device" : 0,
                "speed": 0,
                "min" : 0,
                "max" : 180,
                "num" : 0,
            },
            {
                "type" : "conv",
                "value" : 0,
                "device" : 0,
                "speed": 255,
                "min" : 0,
                "max" : 2,
                "num" : 0,
            }

        ];

        this.eventSource = null;
        
        // this.elements = {
        //     "arm-status" : this.querySel(".arm-status > div > h2"),
        //     "amn-icon" : this.querySel(".amn-icon"),
        //     "amn-config-box" : this.querySel(".amn-config-box"),
        //     "amn-info-box" : this.querySel(".amn-info-box"),
        //     "btn-info" : this.querySel(".btn-info"),
        //     "btn-control" : this.querySel(".btn-control"),
        //     "btn-config" : this.querySel(".btn-config"),
        //     "btn-config-inner" : this.querySel(".btn-config > div > div > a"),
        //     "btn-preset-temp" : this.querySel(".btn-preset-temp"),
        //     "btn-s-control" : this.querySel(".btn-s-control"),
        //     "chip-servo-0" : this.querySel(".chip-servo-0 div > h4"),
        //     "chip-servo-1" : this.querySel(".chip-servo-1 div > h4"),
        //     "chip-servo-2" : this.querySel(".chip-servo-2 div > h4"),
        //     "chip-servo-3" : this.querySel(".chip-servo-3 div > h4"),
        //     "chip-servo-4" : this.querySel(".chip-servo-4 div > h4"),
        //     "chip-servo-5" : this.querySel(".chip-servo-5 div > h4"),
        //     "conf-cur-selmodel" : this.querySel(".conf-cur-selmodel > div > h6"),
        //     "conf-cur-conv1" : this.querySel(".conf-cur-conv1 > div > h6"),
        //     "conf-cur-conv2" : this.querySel(".conf-cur-conv2 > div > h6"),
        //     "form-field-s0" : this.querySel("#form-field-s0"),
        //     "form-field-s1" : this.querySel("#form-field-s1"),
        //     "form-field-s2" : this.querySel("#form-field-s2"),
        //     "form-field-s3" : this.querySel("#form-field-s3"),
        //     "form-field-s4" : this.querySel("#form-field-s4"),
        //     "form-field-s5" : this.querySel("#form-field-s5"),
        //     "form-field-conv1" : this.querySel("#form-field-conv1"),
        //     "form-field-conv2" : this.querySel("#form-field-conv2"),
        //     "form-field-selmodel" : this.querySel("#form-field-selmodel"),
        //     "list" : this.querySelAll(".list"),
        //     "swim-lane" : this.querySelAll(".swim-lane"),
            
        // };
        // this.config = [];
        // this.controlMode = 0;
        // this.convMode = ["หยุด", "เดินหน้า", "ถอยหลัง"];

        this.init();
    }




    
    /**
     * The init function sets up the initial state of the app.
     */
    init() {
        this.consoleLog("「ARMMANE」 by Nattawut Manjai-araya  v1.5.0 Build 20231011184329");

        // Hide element log_disconnect
        this.hideElement("ui", "log_disconnect");

        // Create server selection button
        this.createServerSelectionButton();

        // Show loading screen
        this.showScreen("connect", true);
        
        this.hideElement("btn", "emergency");

        this.setupElementTrigger();

        this.initializeSortable();

        this.getCookies("soundState");
        this.appStatus["soundState"] = this.strToBool(this.getCookies("soundState") == null ? false : this.getCookies("soundState"));
        this.elements["form"]["cconf_sound"].value = String(this.appStatus["soundState"]);
        this.playSoundOnce("welcome.mp3");
    }



    
    /**
     * The setTriggerEvent function is used to assign an event listener to a specific element.
     * @param mode Determine which element is being used
     * @param element_name Identify the element that will be assigned to the event
     * @param event Determine which event to listen for
     * @param func Define the function that will be executed when the event is triggered
     */
    setTriggerEvent(mode, element_name, event, func) {
        if (!this.elements["mode"].includes(mode)) {
            this.consoleLog("「ARMMANE」 Mode " + mode + " not found", "ERROR");
            return;
        }
        this.elements[mode][element_name].addEventListener(event, func);
        this.consoleLog("「ARMMANE」 Element " + element_name + " assigned to " + event + " event");
    }

    //this.querySel with error handling
    querySel(element, doc = document) {
        try {
            return doc.querySelector(element);
        } catch (error) {
            this.consoleLog("「ARMMANE」 Element " + element + " not found", "ERROR");
        }
    }

    querySelAll(element, doc = document) {
        try {
            return doc.querySelectorAll(element);
        } catch (error) {
            this.consoleLog("「ARMMANE」 Element " + element + " not found", "ERROR");
        }
    }

    
    /**
     * The setupElementTrigger function sets up the event listeners for each element.
    */
    setupElementTrigger() {
        // status_toggle
        this.setTriggerEvent("btn", "status_toggle", "click", () => {
            this.toggleStatusInfo();
        });
        //conn_connectsrv
        this.setTriggerEvent("btn", "conn_connectsrv", "click", () => {
            let serverdata = this.getServerURLFromFields();
            try{
                this.changeServer(serverdata[0], serverdata[1], serverdata[2]);
                this.alertLog("กำลังเชื่อมต่อเซิร์ฟเวอร์: " + this.appStatus["server"]["fullURL"], "กรุณารอสักครู่", "info-circle", "#FF006E", 5000);
            }catch(error){
                this.consoleLog("「ARMMANE」 Server Address is invalid", "ERROR");
            }
        });

        // error_btn_selectserver
        this.setTriggerEvent("btn", "error_btn_selectserver", "click", () => {
            this.showScreen("connect", true);
            this.hideElement("btn", "emergency");
        });

        // error_btn_retry
        this.setTriggerEvent("btn", "error_btn_retry", "click", () => {
            this.connect();
        });

                // // Add event listener to save button
                // this.elements["btn"]["cconf_btn_save"].addEventListener("click", saveButtonHandler);

                // // Add event listener to cancel button
                // this.elements["btn"]["cconf_btn_cancel"].addEventListener("click", cancelButtonHandler);
                // const saveButtonHandler = () => {
                //     element.setAttribute("data-type", this.elements["form"]["cconf_01"].value);
                //     element.setAttribute("data-device", this.elements["form"]["cconf_02"].value);
                //     element.setAttribute("data-value", this.elements["form"]["cconf_03"].value);
                //     this.consoleLog("「ARMMANE」 Command changed to " + this.elements["form"]["cconf_01"].value + "(" + this.elements["form"]["cconf_02"].value + "," + this.elements["form"]["cconf_03"].value + ");");
                //     element.querySelector(".cmd-text > div > h2").textContent = this.elements["form"]["cconf_01"].value + "(" + this.elements["form"]["cconf_02"].value + "," + this.elements["form"]["cconf_03"].value + ");";
                //     this.consoleLog("「ARMMANE」 Command changed to element " + element.id + " with value " + element.getAttribute("data-type") + "(" + element.getAttribute("data-device") + "," + element.getAttribute("data-value") + ");");
                //     this.hideElement("ui", "cconfbox");
                //     this.elements["btn"]["cconf_btn_save"].removeEventListener("click", saveButtonHandler);
                // };
        
                // const cancelButtonHandler = () => {
                //     this.hideElement("ui", "cconfbox");
                //     this.elements["btn"]["cconf_btn_cancel"].removeEventListener("click", cancelButtonHandler);
                // };
        this.setTriggerEvent("form", "cconf_01", "change", () => {
            let commandType = this.elements["form"]["cconf_01"].value;
            if(commandType == "servo"){
                this.changeText("cconf_title_1", "คำสั่ง");
                this.changeText("cconf_title_2", "อุปกรณ์ที่ต้องการ");
                this.changeText("cconf_title_3", "องศา");
                this.hideElement("ui", "settingbox4");
                // Set min and max value [TODO]
                // this.elements["form"]["cconf_03"].setAttribute("min", element.getAttribute("data-min"));
                // this.elements["form"]["cconf_03"].setAttribute("max", element.getAttribute("data-max"));
            }else if(commandType == "conv"){
                this.changeText("cconf_title_1", "คำสั่ง");
                this.changeText("cconf_title_2", "อุปกรณ์ที่ต้องการ");
                this.changeText("cconf_title_3", "โหมด");
                this.changeText("cconf_title_4", "ความเร็ว");
                this.showElement("ui", "settingbox4");
            }
        });

        this.setTriggerEvent("form", "box_1", "change", () => {
            this.appStatus["manualBoxControl"] = true;
            clearTimeout(this.appStatus["manualBoxControlTrigger"]);
            this.appStatus["manualBoxControlTrigger"] = setTimeout(() => {
                this.consoleLog("Live update is resumed");
                this.appStatus["manualControl"] = false;
            }, 5000);
        });

        this.setTriggerEvent("form", "box_2", "change", () => {
            this.appStatus["manualBoxControl"] = true;
            clearTimeout(this.appStatus["manualBoxControlTrigger"]);
            this.appStatus["manualBoxControlTrigger"] = setTimeout(() => {
                this.consoleLog("Live update is resumed");
                this.appStatus["manualControl"] = false;
            }, 5000);
        });

        this.setTriggerEvent("form", "box_3", "change", () => {
            this.appStatus["manualBoxControl"] = true;
            clearTimeout(this.appStatus["manualBoxControlTrigger"]);
            this.appStatus["manualBoxControlTrigger"] = setTimeout(() => {
                this.consoleLog("Live update is resumed");
                this.appStatus["manualControl"] = false;
            }, 5000);
        });

        this.setTriggerEvent("btn", "cconf_btn_save", "click", () => {
            let selectedElement = document.getElementById(this.appStatus["currentEditCodeBlock"]);
            selectedElement.setAttribute("data-type", this.elements["form"]["cconf_01"].value);
            selectedElement.setAttribute("data-device", this.elements["form"]["cconf_02"].value);
            selectedElement.setAttribute("data-value", this.elements["form"]["cconf_03"].value);
            selectedElement.setAttribute("data-speed", this.elements["form"]["cconf_04"].value);
            let commandType = this.elements["form"]["cconf_01"].value;
            if(commandType == "servo"){
                // format setServo(device, angle);
                // format setServo(0, 90);
                selectedElement.querySelector(".cmd-text > div > h2").textContent = "setServo(" + this.elements["form"]["cconf_02"].value + ", " + this.elements["form"]["cconf_03"].value + ");";
                this.consoleLog("「ARMMANE」 Command changed to " + this.elements["form"]["cconf_01"].value + "(" + this.elements["form"]["cconf_02"].value + "," + this.elements["form"]["cconf_03"].value + ");");
            }else if(commandType == "conv"){
                // format setConv(device, direction, speed);
                // format setConv(0, 1,255);
                selectedElement.querySelector(".cmd-text > div > h2").textContent = "setConv(" + this.elements["form"]["cconf_02"].value + ", " + this.elements["form"]["cconf_03"].value + ", " + this.elements["form"]["cconf_04"].value + ");";
                this.consoleLog("「ARMMANE」 Command changed to " + this.elements["form"]["cconf_01"].value + "(" + this.elements["form"]["cconf_02"].value + "," + this.elements["form"]["cconf_03"].value + "," + this.elements["form"]["cconf_04"].value + ");");
            }
        });

        this.setTriggerEvent("btn", "cconf_btn_cancel", "click", () => {
            this.hideElement("ui", "cconfbox");
        });

        // let element_fw = this.elements["ui"]["status_conv" + conv + "_forward"].querySelector(".elementor-icon");
        // let element_bw = this.elements["ui"]["status_conv" + conv + "_backward"].querySelector(".elementor-icon");
        // let element_stop = this.elements["ui"]["status_conv" + conv + "_stop"].querySelector(".elementor-icon");

        for (let conv = 0; conv < 2; conv++) {
            this.setTriggerEvent("form", "conv_0" + conv, "change", () => {
                this.controlConv(conv, -1, this.elements["form"]["conv_0" + conv].value);
                this.consoleLog("Live update is paused");
                this.appStatus["manualControl"] = true;
                clearTimeout(this.appStatus["manualControlTrigger"]);
                this.appStatus["manualControlTrigger"] = setTimeout(() => {
                    this.consoleLog("Live update is resumed");
                    this.appStatus["manualControl"] = false;
                }, 10000);
            });

            this.setTriggerEvent("ui", "status_conv0" + conv + "_forward", "click", () => {
                this.controlConv(conv, 1, -1);
            });

            this.setTriggerEvent("ui", "status_conv0" + conv + "_backward", "click", () => {
                this.controlConv(conv, 2, -1);
            });

            this.setTriggerEvent("ui", "status_conv0" + conv + "_stop", "click", () => {
                this.controlConv(conv, 0, -1);
            });
        }

        for (let box = 1; box <= 3; box++) {
            this.setTriggerEvent("form", "box_" + box, "change", () => {
                this.setBoxItem(box, this.elements["form"]["box_" + box].value);
                this.consoleLog("Live update is paused");
                this.appStatus["manualBoxControl"] = true;
                clearTimeout(this.appStatus["manualBoxControlTrigger"]);
                this.appStatus["manualBoxControlTrigger"] = setTimeout(() => {
                    this.consoleLog("Live update is resumed");
                    this.appStatus["manualBoxControl"] = false;
                }, 5000);
            });
        }

        for (let servo = 0; servo < 6; servo++) {
            this.setTriggerEvent("form", "servo_0" + servo, "change", () => {
                this.consoleLog("Live update is paused");
                this.controlServo(servo, this.elements["form"]["servo_0" + servo].value);
                // set manual control trigger to true
                this.appStatus["manualControl"] = true;
                // set manual control trigger to false after 10 second
                clearTimeout(this.appStatus["manualControlTrigger"]);
                this.appStatus["manualControlTrigger"] = setTimeout(() => {
                    this.consoleLog("Live update is resumed");
                    this.appStatus["manualControl"] = false;
                }, 10000);
                
            });
        }

        for (let servo = 0; servo < 6; servo++) {
            this.setTriggerEvent("btn", "test_servo_" + servo, "click", () => {
                this.consoleLog("「ARMMANE」 Test servo " + servo);
                this.testServo(servo);
            });
        }

        for (let conv = 0; conv < 1; conv++) {
            this.setTriggerEvent("btn", "test_conv_" + conv, "click", () => {
                this.consoleLog("「ARMMANE」 Test conv " + conv);
                this.testConv(conv);
            });
        }

        this.setTriggerEvent("btn", "main_info", "click", () => {
            this.mainArea("info");
        });

        this.setTriggerEvent("btn", "main_control", "click", () => {
            this.mainArea("control");
        }
        );

        this.setTriggerEvent("btn", "main_config", "click", () => {
            this.mainArea("setting");
        }
        );

        this.setTriggerEvent("btn", "main_auto", "click", () => {
            this.setAuto();
        }
        );

        this.setTriggerEvent("btn", "main_mode", "click", () => {
            this.setMode();
        }
        );

        this.setTriggerEvent("btn", "emergency", "click", () => {
            this.emergency();
        }
        );

        this.setTriggerEvent("form", "cconf_sound", "change", () => {
            this.setSoundState();
            this.setCookies("soundState", this.appStatus["soundState"])
        }
        );

        this.setTriggerEvent("form", "camera_list", "change", () => {
            this.getCameraList();
        }
        );

        this.setTriggerEvent("form", "camera_list_alt", "change", () => {
            this.getCameraList();
        }
        );

        this.setTriggerEvent("form", "model_list", "change", () => {
            this.selectModel();
        }
        );

        this.setTriggerEvent("form", "model_list_alt", "change", () => {
            this.selectModel();
        }
        );

        this.setTriggerEvent("ui", "status_cam_savepower", "click", () => {
            this.savePower();        
        }
        );

        this.setTriggerEvent("ui", "status_cam_enable", "click", () => {
            this.enableCamera();        
        }
        );

        this.setTriggerEvent("ui", "status_cam_disable", "click", () => {
            this.disableCamera();        
        }
        );

        this.setTriggerEvent("ui", "status_predict_on", "click", () => {
            this.enablePredict();        
        }
        );

        this.setTriggerEvent("ui", "status_predict_off", "click", () => {
            this.disablePredict();        
        }
        );

        this.setTriggerEvent("btn", "camera_refresh", "click", () => {
            this.getCameraList();
        }
        );

        this.setTriggerEvent("btn", "camera_refresh_alt", "click", () => {
            this.getCameraList();
        }
        );

        this.setTriggerEvent("btn", "model_refresh", "click", () => {
            this.getModelList();
        }
        );

        this.setTriggerEvent("btn", "model_refresh_alt", "click", () => {
            this.getModelList();
        }
        );

        this.setTriggerEvent("btn", "setup_step_2", "click", () => {
            this.hideElement("ui", "ui_test_step_1");
            this.showElement("ui", "ui_test_step_2");
        }
        );
    }

    
    /**
     * The toggleStatusInfo function toggles the display of the log area.
     */
    toggleStatusInfo() {
        if (this.elements["ui"]["log_area"].style.display == "none") {
            this.elements["ui"]["log_area"].style.display = "flex";
        }else{
            this.elements["ui"]["log_area"].style.display = "none";
        }
    }



    /**
     * The showScreen function shows the screen that was specified.
     * @param screen_name Identify which screen to show
     */
    showScreen(screen_name, hide_all = false) {
        if (hide_all) {
            this.hideAllScreen();
        }
        this.elements["screen"][screen_name].style.display = "flex";
        this.appStatus["currentScreen"] = screen_name;
    }


    
    /**
     * The hideScreen function hides the screen that was specified.
     * @param screen_name Identify which screen to hide
     */
    hideScreen(screen_name) {
        this.elements["screen"][screen_name].style.display = "none";
    }



    
    /**
     * The hideAllScreen function hides all the screens from the UI.
     */
    hideAllScreen() {
        for (var key in this.elements["screen"]) {
            this.hideScreen(key);
        }
    }


    
    /**
     * The logSet function is used to set the log title, subtitle and number.
     * 
     *
     * @param title Change the title text of the log
     * @param subtitle Change the text of the subtitle of the log
     * @param number Change the number of progress bar and text of the log
     */
    logSet(title="", subtitle="", number=""){
        if(title != ""){
            this.changeText("log_title", title);
        }
        if(subtitle != ""){
            this.changeText("log_subtitle", subtitle);
        }
        if(number != ""){
            this.changeText("log-number", number);
            this.changeProgress(number);
        }
        // Icon will change based on the title text
        //If title contain "ERROR" then change icon to exclamation-triangle
        if(title.includes("ERROR")){
            this.changeIcon("log_icon", "exclamation-triangle");
            this.changeColor("log_icon", "#B11D1D");
        }
    }




    
    /**
     * The createServerSelectionButton function creates a button for each server in the server list.
     * The buttons are added to the UI element with id "box_serverlist".
     */
    createServerSelectionButton() {
        for (var i = 0; i < this.appStatus["serverList"].length; i++) {
            let newdiv = this.elements["template"]["btn_serverlist"].cloneNode(true);
            // Add classnames to button
            newdiv.classList.add("btn-server");
            newdiv.classList.add("btn-serverlist-" + i);
            // remove template class
            newdiv.classList.remove("tp-btn-server");
            // Change button text
            newdiv.querySelector(".elementor-button-text").textContent = this.appStatus["serverList"][i]["name"];
            newdiv.style.display = "flex";
            // Add property to button for access server list
            newdiv.address = this.appStatus["serverList"][i]["address"];
            newdiv.port = this.appStatus["serverList"][i]["port"];
            newdiv.protocol = this.appStatus["serverList"][i]["protocol"];
            // Add event listener to button
            newdiv.addEventListener("click", () => {
                // Called function to change server
                this.changeServer(newdiv.address, newdiv.port, newdiv.protocol);
            });
            // Append button to [ui][box_serverlist]>div>newdiv
            this.elements["ui"]["box_serverlist"].querySelector("div").appendChild(newdiv);
        }
    }

    
    /**
     * The changeServer function changes the server that the app is connected to.
     * @param address Set the address of the server
     * @param port Set the port number of the server
     * @param protocol Change the protocol of the server
     */
    changeServer(address, port, protocol) {
        this.appStatus["server"]["address"] = address;
        this.appStatus["server"]["port"] = port;
        this.appStatus["server"]["protocol"] = protocol;
        this.appStatus["server"]["fullURL"] = protocol + "://" + address + (port ? ":" + port : "");
        this.consoleLog("「ARMMANE」 Server changed to " + this.appStatus["server"]["fullURL"]);
        this.connectToServer();
    }


    /**
     * The connectToServer function connects the app to the server.
     */
    connectToServer() {
        this.consoleLog("「ARMMANE」 Connecting to server at " + this.appStatus["server"]["fullURL"]);
        this.changeText("connect_url", this.appStatus["server"]["fullURL"]);
        this.changeText("connect_status", "กำลังเตรียมเชื่อมต่อ");
        this.showScreen("loading", true);
        this.hideElement("btn", "emergency");
        this.connect();
        // Wait for 3 seconds If connected show main screen
        setTimeout(() => {
            if (this.appStatus["connected"]) {
                this.mainScreen();
                this.hideElement("ui", "log_disconnect");
                this.consoleLog("「ARMMANE」 Connected to server at " + this.appStatus["server"]["fullURL"]);
                this.alertLog("เชื่อมต่อเซิร์ฟเวอร์สำเร็จ", "กำลังเข้าสู่หน้าหลัก", "info-circle", "#FF006E", 5000);
            }
        }, 3000);
        // Wait for 10 seconds If still not connected show error
        setTimeout(() => {
            if (!this.appStatus["connected"]) {
                this.showScreen("connect", true);
                this.hideElement("btn", "emergency");
                this.hideElement("ui", "log_disconnect");
                this.consoleLog("「ARMMANE」 Connection to server at " + this.appStatus["server"]["fullURL"] + " failed", "ERROR");
                this.alertLog("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", "กรุณาตรวจสอบการเชื่อมต่อ", "exclamation-triangle", "#B11D1D",5000);
                this.playSoundOnce("notconnect.mp3");
                this.disconnect();
            }else{
                this.hideElement("ui", "log_disconnect");
                this.mainScreen();
            }
        }, 10000);
    }



    
    /**
     * The getServerURLFromFields function takes the value of the connection address field and parses it to determine
     * what protocol, port, and address should be used for connecting to a server.
     * @return An array of 3 elements:
     *        1. The address of the server
     *        2. The port number of the server
     *        3. The protocol of the server
     */
    getServerURLFromFields() {
        var address = this.elements["form"]["conn_address_field"].value;
        // saparate address and port if include protocol also
        var protocol = "https";
        var port = "";
        if (address.includes("https://")) {
            protocol = "https";
            address = address.replace("https://", "");
        }

        if (address.includes("http://")) {
            protocol = "http";
            address = address.replace("http://", "");
        }

        if (address.includes(":")) {
            var split = address.split(":");
            address = split[0];
            port = split[1];
        }

        if (protocol == "") {
            protocol = "https";
        }

        if (address == "") {
            address = "localhost";
        }

        // Regex to check if full address is valid
        var regex = new RegExp("^(http|https)://[^/]+(:[0-9]+)?$");
        if (!regex.test(this.elements["form"]["conn_address_field"].value)) {
            this.consoleLog("「ARMMANE」 Invalid address: " + this.elements["form"]["conn_address_field"].value, "ERROR");
            this.alertLog("ที่อยู่เซิร์ฟเวอร์ไม่ถูกต้อง: " + this.elements["form"]["conn_address_field"].value, "กรุณาตรวจสอบที่อยู่เซิร์ฟเวอร์", "exclamation-triangle", "#B11D1D",1000);
            return;
        }

        this.consoleLog("「ARMMANE」 Server address: " + address + ", Port: " + (port ? port : "default") + ", Protocol: " + protocol);
        return [address, port, protocol];

    }


    
    /**
     * The alertLog function creates a new alert log in the User Interface.
     * @param title Set the title of the alert
     * @param message Display the message in the alert
     * @param icon Set the icon of the alert
     * @param color Change the background color of the alert
     * @param time Set the time in milliseconds for which the alert will be displayed
     */
    alertLog(title, message, icon = null, color = null, time = 5000) {
        if (icon == null) {
            icon = "info-circle";
        }
        if (color == null) {
            color = "#B11D1D";
        }
        let alertdiv = this.elements["template"]["log_alert"].cloneNode(true);
        alertdiv.classList.remove("tp-log-alert");
        let randomid = Math.floor(Math.random() * 1000000);
        alertdiv.classList.add("log-alert-" + randomid);
        alertdiv.querySelector("div").style.backgroundColor = color;
        alertdiv.querySelector(".err-icon").querySelector("div > i").className = "fas fa-" + icon;
        alertdiv.querySelector(".err-icon").querySelector("div > i").style.color = color;
        alertdiv.querySelector(".err-title").querySelector("div > h2").textContent = title;
        alertdiv.querySelector(".err-subtitle").querySelector("div > h5").textContent = message;
        alertdiv.style.display = "flex";
        alertdiv.style.visibility = "visible";
        alertdiv.addEventListener("click", () => {
            try {
                this.elements["ui"]["logmane"].querySelector("div").removeChild(alertdiv);
            } catch (error) {
                this.consoleLog("Already removed the element maybe by click" + error, "WARN");
            }     
        }
        );
        this.elements["ui"]["logmane"].querySelector("div").insertBefore(alertdiv, this.elements["ui"]["logmane"].querySelector("div").childNodes[2]);
        setTimeout(() => {
            try {
                this.elements["ui"]["logmane"].querySelector("div").removeChild(alertdiv);
            } catch (error) {
                this.consoleLog("Already removed the element maybe by click" + error, "WARN");
            }
            
        }, time);
    }

    /**
     * The connect function connects to the server via SSE and sets up event listeners for Server Sent Events.
     */
    connect() {
        this.updateConnectionStatus("กำลังเชื่อมต่อกับเซิร์ฟเวอร์");
    
        if (this.appStatus["connected"] || this.eventSource !== null) {
            this.updateConnectionStatus("มีการเชื่อมต่ออยู่แล้ว กำลังตัดการเชื่อมต่อ");
            this.disconnect();
            this.appStatus["connected"] = false;
        }
    
        this.eventSource = new EventSource(this.appStatus["server"]["fullURL"] + "/sse/status");
    
        this.eventSource.onopen = () => {
            this.updateConnectionStatus("กำลังเชื่อมต่อกับเซิร์ฟเวอร์");
            this.playSoundOnce("connecting.mp3");
            this.consoleLog("[INFO] SSE connecting to " + this.appStatus["server"]["fullURL"]);
        };
    
        this.eventSource.onerror = () => {
            this.handleConnectionError();
        };
    
        this.eventSource.onmessage = (event) => {
            this.handleMessage(event.data);
        };

        this.eventSource.addEventListener("seri_status", (event) => {
            this.seriStatus = JSON.parse(event.data);
            // this.consoleLog("[INFO] SSE seri_status: " + event.data);
            this.handleSeriStatus(event.data);
        });

        this.eventSource.addEventListener("arm_status", (event) => {
            this.armStatus = JSON.parse(event.data);
            // this.consoleLog("[INFO] SSE arm_status: " + event.data);
            this.handleArmStatus(event.data);
        });

        this.eventSource.addEventListener("prediction", (event) => {
            // this.consoleLog("[INFO] SSE received prediction data");
            this.handlePrediction(event.data);
        });

        this.eventSource.addEventListener("alert_status", (event) => {
            this.statusAlert = JSON.parse(event.data);
            this.consoleLog("[INFO] SSE received status : " + event.data);
            this.handleAlertStatus(event.data);
        });


        this.getCameraList();
        this.getModelList();
        this.initializePreset();
        this.handleVideoStream();
    }
    
    
    /**
     * The updateConnectionStatus function updates the text of the connection status element.
     * @param status Update the text of the connect_status element
     */
    updateConnectionStatus(status) {
        this.changeText("connect_status", status);
    }
    

    
    /**
     * The handleConnectionError function is called when the connection to the server is lost.
     * It updates the connection status and logs a message in console.
     */
    handleConnectionError() {
        this.updateConnectionStatus("เกิดข้อผิดพลาดในการเชื่อมต่อ กำลังลองเชื่อมต่อใหม่");
        this.consoleLog("[INFO] SSE disconnected from " + this.appStatus["server"]["fullURL"], "WARN");
    
        if (this.appStatus["currentScreen"] === "main") {
            this.appStatus["isDisconnecting"] = true;
            this.appStatus["connected"] = false;
            this.showElement("ui", "log_disconnect");
            this.disconnect();
        }
    }
    
    
    /**
     * The handleMessage function is called when the SSE connection receives a message.
     * It checks if the app is in loading or connect screens, and if so, it switches to main screen.
     * If not, it logs that the SSE has connected to a server.
     * @param data Data received from the server
     */
    handleMessage(data) {
        console.log(data);
        this.playSoundOnce("connected.mp3");
        if (this.appStatus["currentScreen"] === "main") {
            if (this.appStatus["isDisconnecting"] || !this.appStatus["connected"]) {
                this.consoleLog("[INFO] SSE connected to " + this.appStatus["server"]["fullURL"]);
                this.appStatus["isDisconnecting"] = false;
                this.appStatus["connected"] = true;
                this.hideElement("ui", "log_disconnect");
            }
        }
    
        if (this.appStatus["currentScreen"] === "loading" || this.appStatus["currentScreen"] === "connect") {
            this.appStatus["isDisconnecting"] = false;
            this.appStatus["connected"] = true;
            setTimeout(() => {
                this.mainScreen();
            }, 1000);
            this.consoleLog("[INFO] SSE connected to " + this.appStatus["server"]["fullURL"]);
        }
    
    }

    handleAlertStatus(data) {
        let alertStatus = JSON.parse(data);
        this.consoleLog("[INFO] SSE received alert_status: " + data);

        if (alertStatus["arm"]["gripcheck_not_working"] == false){
            this.elements["text"]["test_grip_result_title"].textContent = "ผ่าน"
            this.elements["ui"]["test_grip_result"].style.color = "#02F51A"
        }

        alertStatus["arm"]["shuffle_currently"] ?  this.showElement("ui", "alert_shuffle") : this.hideElement("ui", "alert_shuffle");

        alertStatus["arm"]["grip_failed"] ?  this.showElement("ui", "alert_missgrip") : this.hideElement("ui", "alert_missgrip");

        alertStatus["arm"]["not_find_object"] ?  this.showElement("ui", "alert_missingobj") : this.hideElement("ui", "alert_missingobj");

        alertStatus["arm"]["not_recognize_object"] ?  this.showElement("ui", "alert_norecobj") : this.hideElement("ui", "alert_norecobj");

        alertStatus["arm"]["not_recognize_object_limit"] ?  this.showElement("ui", "alert_norecobjlim") : this.hideElement("ui", "alert_norecobjlim");

        alertStatus["arm"]["gripcheck_not_working"] ?  this.showElement("ui", "alert_nogripcheck") : this.hideElement("ui", "alert_nogripcheck");

        alertStatus["arm"]["grip_failed_limit"] ?  this.showElement("ui", "alert_gripfaillim") : this.hideElement("ui", "alert_gripfaillim");

        alertStatus["seri"]["arduino_not_found"] ?  this.showElement("ui", "alert_noard") : this.hideElement("ui", "alert_noard");

        alertStatus["seri"]["windows_detected"] ?  this.showElement("ui", "alert_wintec") : this.hideElement("ui", "alert_wintec");

        alertStatus["seri"]["sensor_not_working"] ?  this.showElement("ui", "alert_nosen") : this.hideElement("ui", "alert_nosen");

        alertStatus["seri"]["emergency_mode_activated"] ?  this.showElement("ui", "alert_emergencyactivated") : this.hideElement("ui", "alert_emergencyactivated");

        alertStatus["seri"]["sending_message_failed"] ?  this.showElement("ui", "alert_sendmessagefail") : this.hideElement("ui", "alert_sendmessagefail");

        alertStatus["seri"]["high_cpu_usage"] ?  this.showElement("ui", "alert_highcpuuse") : this.hideElement("ui", "alert_highcpuuse");

        alertStatus["seri"]["high_memory_usage"] ?  this.showElement("ui", "alert_highmemuse") : this.hideElement("ui", "alert_highmemuse");

        alertStatus["seri"]["high_disk_usage"] ?  this.showElement("ui", "alert_highdiskuse") : this.hideElement("ui", "alert_highdiskuse");

        alertStatus["tf"]["camera_not_working"] ?  this.showElement("ui", "alert_nocam") : this.hideElement("ui", "alert_nocam");

        alertStatus["tf"]["model_not_working"] ?  this.showElement("ui", "alert_nomodel") : this.hideElement("ui", "alert_nomodel");
    }

    
    /**
     * The disconnect function closes the eventSource and sets the appStatus["connected"] to false.
     */
    disconnect() {
        this.eventSource.close();
        this.appStatus["connected"] = false;
        this.eventSource = null;
        this.consoleLog("[INFO] SSE disconnected from " + this.appStatus["server"]["fullURL"],"WARN");
    }


    
    /**
     * The mainScreen function is used to show the main screen.
     */
    mainScreen() {
        this.showScreen("main", true);
        this.showElement("btn", "emergency");
        this.showElement("ui", "statusbox");
        this.hideElement("ui", "controlbox");
        this.showElement("ui", "statusarea");
        this.hideElement("ui", "settingarea");
    }

    mainArea(area){
        switch (area) {
            case "info":
                this.showElement("ui", "statusbox");
                this.hideElement("ui", "controlbox");
                this.showElement("ui", "statusarea");
                this.hideElement("ui", "settingarea");
                this.appStatus["commandMode"] = false;
                for (let servo = 0; servo < 6; servo++) {
                    this.elements["form"]["servo_0" + servo].disabled = true;
                }
                for (let conv = 0; conv < 2; conv++) {
                    this.elements["form"]["conv_0" + conv].disabled = true;
                }                
                break;               
            case "control":
                this.hideElement("ui", "statusbox");
                this.showElement("ui", "controlbox");
                this.showElement("ui", "statusarea");
                this.hideElement("ui", "settingarea");
                this.appStatus["commandMode"] = true;
                for (let servo = 0; servo < 6; servo++) {
                    this.elements["form"]["servo_0" + servo].disabled = false;
                }
                for (let conv = 0; conv < 2; conv++) {
                    this.elements["form"]["conv_0" + conv].disabled = false;
                }
                break;
            case "setting":
                this.hideElement("ui", "statusarea");
                this.showElement("ui", "settingarea");
                break;
            default:
                break;
        }
    }


    
    /**
     * The handleSeriStatus function is used to update the arm status in the UI.
     * @param data Store the data received from the server
     */
    handleSeriStatus(data) {
        let armStatus = JSON.parse(data);
        if ((!this.appStatus["commandMode"]) || (!this.appStatus["manualControl"])) {
            for (let servo = 0; servo < 6; servo++) {
                this.elements["form"]["servo_0" + servo].value = armStatus["servo"][servo];
            }
            for (let conv = 0; conv < 2; conv++) {
                this.elements["form"]["conv_0" + conv].value = armStatus["conv"]["speed"][conv];
            }
        }else{
        }
        if (!armStatus["emergency"]){
            document.querySelector(".btn-emergency-toggle").querySelector("a").style.backgroundColor = "#FF0000";
            this.changeText("emergency_title", "หยุดฉุกเฉิน");
        }else{
            document.querySelector(".btn-emergency-toggle").querySelector("a").style.backgroundColor = "#FF7B00";
            this.changeText("emergency_title", "ทำงานต่อ");
        }
        this.handleConvStatus(0, armStatus["conv"]["mode"][0]);
        this.handleConvStatus(1, armStatus["conv"]["mode"][1]);
        this.handleInfStatus(armStatus["sensor"]);
        this.logSet(armStatus["status"], armStatus["message"], armStatus["progress"] || "");
        // "info_os_title" : this.querySel(".info-os").querySelector("h4"),
        // "info_version_title" : this.querySel(".info-version").querySelector("h4"),
        // "info_release_title" : this.querySel(".info-release").querySelector("h4"),
        // "info_machine_title" : this.querySel(".info-machine").querySelector("h4"),
        // "info_processor_title" : this.querySel(".info-processor").querySelector("h4"),
        // "info_python_version_title" : this.querySel(".info-python-version").querySelector("h4"),
        // "info_cpu_usage_title" : this.querySel(".info-cpu-usage").querySelectorAll("span")[2],
        // "info_memory_usage_title" : this.querySel(".info-memory-usage").querySelectorAll("span")[2],
        // "info_disk_usage_title" : this.querySel(".info-disk-usage").querySelectorAll("span")[2],
        this.elements["text"]["info_os_title"].textContent = armStatus["system"]["os"] == "" || armStatus["system"]["os"] == null ? "ไม่ระบุ" : String(armStatus["system"]["os"]);
        this.elements["text"]["info_version_title"].textContent = armStatus["system"]["version"] == "" || armStatus["system"]["version"] == null ? "ไม่ระบุ" : String(armStatus["system"]["version"]);
        this.elements["text"]["info_release_title"].textContent = armStatus["system"]["release"] == "" || armStatus["system"]["release"] == null ? "ไม่ระบุ" : String(armStatus["system"]["release"]);
        this.elements["text"]["info_machine_title"].textContent = armStatus["system"]["machine"] == "" || armStatus["system"]["machine"] == null ? "ไม่ระบุ" : String(armStatus["system"]["machine"]);
        this.elements["text"]["info_processor_title"].textContent = armStatus["system"]["processor"] == "" || armStatus["system"]["processor"] == null ? "ไม่ระบุ" : String(armStatus["system"]["processor"]);
        this.elements["text"]["info_python_version_title"].textContent = armStatus["system"]["python_version"] == "" || armStatus["system"]["python_version"] == null ? "ไม่ระบุ" : String(armStatus["system"]["python_version"]);
        this.elements["text"]["info_cpu_usage_title"].textContent = armStatus["system"]["cpu_usage"] == "" || armStatus["system"]["cpu_usage"] == null ? "ไม่ระบุ" : String(armStatus["system"]["cpu_usage"]);
        this.elements["ui"]["info_cpu_usage"].querySelectorAll("div")[2].style.width = armStatus["system"]["cpu_usage"] == "" || armStatus["system"]["cpu_usage"] == null ? "0%" : String(armStatus["system"]["cpu_usage"] + "%");
        this.elements["ui"]["info_cpu_usage"].querySelectorAll("span")[2].textContent = armStatus["system"]["cpu_usage"] == "" || armStatus["system"]["cpu_usage"] == null ? "ไม่ระบุ" : String(armStatus["system"]["cpu_usage"] + "%");
        this.elements["text"]["info_memory_usage_title"].textContent = armStatus["system"]["memory_usage"] == "" || armStatus["system"]["memory_usage"] == null ? "ไม่ระบุ" : String(armStatus["system"]["memory_usage"]);
        this.elements["ui"]["info_memory_usage"].querySelectorAll("div")[2].style.width = armStatus["system"]["memory_usage"] == "" || armStatus["system"]["memory_usage"] == null ? "0%" : String(armStatus["system"]["memory_usage"] + "%");
        this.elements["ui"]["info_memory_usage"].querySelectorAll("span")[2].textContent = armStatus["system"]["memory_usage"] == "" || armStatus["system"]["memory_usage"] == null ? "ไม่ระบุ" : String(armStatus["system"]["memory_usage"] + "%");
        this.elements["text"]["info_disk_usage_title"].textContent = armStatus["system"]["disk_usage"] == "" || armStatus["system"]["disk_usage"] == null ? "ไม่ระบุ" : String(armStatus["system"]["disk_usage"]);
        this.elements["ui"]["info_disk_usage"].querySelectorAll("div")[2].style.width = armStatus["system"]["disk_usage"] == "" || armStatus["system"]["disk_usage"] == null ? "0%" : String(armStatus["system"]["disk_usage"] + "%");
        this.elements["ui"]["info_disk_usage"].querySelectorAll("span")[2].textContent = armStatus["system"]["disk_usage"] == "" || armStatus["system"]["disk_usage"] == null ? "ไม่ระบุ" : String(armStatus["system"]["disk_usage"] + "%");
    }


    handlePrediction(data) {
        let prediction = JSON.parse(data);
        this.changeText("prediction_class", prediction["current_classes"]);
        this.changeText("prediction_class_alt", prediction["current_classes"]);
        this.changeText("prediction_confident",  "ความมั่นใจ: " + prediction["confident_score"] + "%");
        this.changeText("prediction_confident_alt",  "ความมั่นใจ: " + prediction["confident_score"] + "%");
        if(prediction["current_classes"].includes("Triangle")){
            this.changeIcon("pred_icon", "eject");
            this.changeIcon("pred_icon_alt", "eject");
        } else if(prediction["current_classes"].includes("Square")){
            this.changeIcon("pred_icon", "square");
            this.changeIcon("pred_icon_alt", "square");
        } else if(prediction["current_classes"].includes("Cylinder")){
            this.changeIcon("pred_icon", "database");
            this.changeIcon("pred_icon_alt", "database");
        }
        else{
            this.changeIcon("pred_icon", "question");
            this.changeIcon("pred_icon_alt", "question");
        }
        if(prediction["current_classes"].includes("White")){
            this.elements["ui"]["pred_box"].style.backgroundColor = "#FFFFFF";
            this.elements["ui"]["pred_box_alt"].style.backgroundColor = "#FFFFFF";
            this.elements["text"]["prediction_confident"].style.color = "#F7496A";
            this.elements["text"]["prediction_confident_alt"].style.color = "#F7496A";
            this.elements["text"]["prediction_class"].style.color = "#F7496A";
            this.elements["text"]["prediction_class_alt"].style.color = "#F7496A";
            this.elements["icon"]["pred_icon"].style.color = "#F7496A";
            this.elements["icon"]["pred_icon_alt"].style.color = "#F7496A";
        } else if(prediction["current_classes"].includes("Red")){
            this.elements["ui"]["pred_box"].style.backgroundColor = "#F7496A";
            this.elements["ui"]["pred_box_alt"].style.backgroundColor = "#F7496A";
            this.elements["text"]["prediction_confident"].style.color = "#FFFFFF";
            this.elements["text"]["prediction_confident_alt"].style.color = "#FFFFFF";
            this.elements["text"]["prediction_class"].style.color = "#FFFFFF";
            this.elements["text"]["prediction_class_alt"].style.color = "#FFFFFF";
            this.elements["icon"]["pred_icon"].style.color = "#FFFFFF";
            this.elements["icon"]["pred_icon_alt"].style.color = "#FFFFFF";
        } else if(prediction["current_classes"].includes("Blue")){
            this.elements["ui"]["pred_box"].style.backgroundColor = "#006EFF";
            this.elements["ui"]["pred_box_alt"].style.backgroundColor = "#006EFF";
            this.elements["text"]["prediction_confident"].style.color = "#FFFFFF";
            this.elements["text"]["prediction_confident_alt"].style.color = "#FFFFFF";
            this.elements["text"]["prediction_class"].style.color = "#FFFFFF";
            this.elements["text"]["prediction_class_alt"].style.color = "#FFFFFF";
            this.elements["icon"]["pred_icon"].style.color = "#FFFFFF";
            this.elements["icon"]["pred_icon_alt"].style.color = "#FFFFFF";
        }
        if(prediction["camera_running"] == true) {
            this.elements["ui"]["status_cam_enable"].querySelector(".elementor-icon").style.backgroundColor = "#F7496A"
            this.elements["ui"]["status_cam_disable"].querySelector(".elementor-icon").style.backgroundColor = "#FCA5B6"
        } else{
            this.elements["ui"]["status_cam_enable"].querySelector(".elementor-icon").style.backgroundColor = "#FCA5B6"
            this.elements["ui"]["status_cam_disable"].querySelector(".elementor-icon").style.backgroundColor = "#F7496A"
        }
        this.handlePredictionStatus(prediction);
    }

    handlePredictionStatus(data) {
        let prediction = data;
        if(prediction["detect_running"] == true) {
            this.elements["ui"]["status_predict_on"].querySelector(".elementor-icon").style.backgroundColor = "#F7496A"
            this.elements["ui"]["status_predict_off"].querySelector(".elementor-icon").style.backgroundColor = "#FCA5B6"
        } else{
            this.elements["ui"]["status_predict_on"].querySelector(".elementor-icon").style.backgroundColor = "#FCA5B6"
            this.elements["ui"]["status_predict_off"].querySelector(".elementor-icon").style.backgroundColor = "#F7496A"
        }
    }

    //data {"step": 2, "idle": true, "start": 0, "mode": 1, "drop": null, "shape": false, "error": 0, "pickup_count": [2, 2, 2], "items": [1, 2, 2]}
    handleArmStatus(data) {
        let armStatus = JSON.parse(data);
        this.elements["ui"]["box_step_1"].style.backgroundColor = "";
        this.elements["ui"]["box_step_2"].style.backgroundColor = "";
        this.elements["ui"]["box_step_3"].style.backgroundColor = "";
        this.elements["ui"]["box_step_4"].style.backgroundColor = "";
        this.elements["ui"]["box_step_5"].style.backgroundColor = "";
        if(this.appStatus["manualBoxControl"] != true ){
            this.elements["form"]["box_1"].value = armStatus["items"][0];
            this.elements["form"]["box_2"].value = armStatus["items"][1];
            this.elements["form"]["box_3"].value = armStatus["items"][2];
        }

        if(armStatus["step"] == 1 && this.appStatus["lastArmStep"] != 1){
            this.elements["ui"]["box_step_1"].style.backgroundColor = "#FCA5B6";
            this.playSoundOnce("object_grip.mp3");
            this.appStatus["lastArmStep"] = 1; 
        }else if(armStatus["step"] == 2 && this.appStatus["lastArmStep"] != 2){
            this.elements["ui"]["box_step_2"].style.backgroundColor = "#FCA5B6";
            this.playSoundOnce("object_dropbelt.mp3");
            this.appStatus["lastArmStep"] = 2;
        }else if(armStatus["step"] == 3 && this.appStatus["lastArmStep"] != 3){
            this.elements["ui"]["box_step_3"].style.backgroundColor = "#FCA5B6";
            this.playSoundOnce("object_conv.mp3");
            this.appStatus["lastArmStep"] = 3;
        }else if(armStatus["step"] == 4 && this.appStatus["lastArmStep"] != 4){
            this.elements["ui"]["box_step_4"].style.backgroundColor = "#FCA5B6";
            this.playSoundOnce("object_reg.mp3");
            this.appStatus["lastArmStep"] = 4;
        }else if(armStatus["step"] == 5 && this.appStatus["lastArmStep"] != 5){
            this.elements["ui"]["box_step_5"].style.backgroundColor = "#FCA5B6";
            this.appStatus["lastArmStep"] = 5;
        }else{
            this.appStatus["lastArmStep"] = -1;
        }

        if(armStatus["mode"] == 1 ){
            this.elements["text"]["main_auto_title"].textContent = "อัตโนมัติ";
            this.appStatus["lastArmStatusMode"] = 1;
            
        }else{
            this.elements["text"]["main_auto_title"].textContent = "ควบคุมด้วยตนเอง";
            this.appStatus["lastArmStatusMode"] = 0;
        }

        if(armStatus["sorting"] == 1){
            this.elements["text"]["main_mode_title"].textContent = "ตรวจจับวัตถุด้วยสี";
            this.appStatus["lastArmStatusSortingMode"] = 1;
        }else if(armStatus["sorting"] == 0){
            this.elements["text"]["main_mode_title"].textContent = "ตรวจจับวัตถุด้วยรูปร่าง";
            this.appStatus["lastArmStatusSortingMode"] = 0;
        }else{
            this.elements["text"]["main_mode_title"].textContent = "ไม่มีโหมด";
            this.appStatus["lastArmStatusSortingMode"] = 2;
        }

        if(armStatus["drop"] == 0 && this.appStatus["lastDropBoxPosition"] != 0){
            this.elements["ui"]["box_status_a"].classList.add("drop-inprogress");
            this.elements["ui"]["box_status_b"].classList.remove("drop-inprogress");
            this.elements["ui"]["box_status_c"].classList.remove("drop-inprogress");
            this.appStatus["lastDropBoxPosition"] = 0;
            this.playSoundOnce("drop_a.mp3");
        }else if(armStatus["drop"] == 1 && this.appStatus["lastDropBoxPosition"] != 1){
            this.elements["ui"]["box_status_a"].classList.remove("drop-inprogress");
            this.elements["ui"]["box_status_b"].classList.add("drop-inprogress");
            this.elements["ui"]["box_status_c"].classList.remove("drop-inprogress");
            this.appStatus["lastDropBoxPosition"] = 1;
            this.playSoundOnce("drop_b.mp3");
        }else if(armStatus["drop"] == 2 && this.appStatus["lastDropBoxPosition"] != 2){
            this.elements["ui"]["box_status_a"].classList.remove("drop-inprogress");
            this.elements["ui"]["box_status_b"].classList.remove("drop-inprogress");
            this.elements["ui"]["box_status_c"].classList.add("drop-inprogress");
            this.appStatus["lastDropBoxPosition"] = 2;
            this.playSoundOnce("drop_c.mp3");
        }else{
            this.elements["ui"]["box_status_a"].classList.remove("drop-inprogress");
            this.elements["ui"]["box_status_b"].classList.remove("drop-inprogress");
            this.elements["ui"]["box_status_c"].classList.remove("drop-inprogress");
            this.appStatus["lastDropBoxPosition"] = -1;
        }

        this.handleCameraStatus(armStatus);
    }




    handleVideoStream() {
        // url is /stream/video (without prediction overlay) and /stream/video2 (with prediction overlay)
        //From StreamingResponse(generate(), media_type="multipart/x-mixed-replace; boundary=frame")
        this.elements["ui"]["livepreview"].querySelector("img").src = this.appStatus["server"]["fullURL"] + "/stream/video2";
        this.elements["ui"]["livepreview_test"].querySelector("img").src = this.appStatus["server"]["fullURL"] + "/stream/video2";
        var retryVideoStreamCount = 0;
        // Detect if the server connection is lost
        if(retryVideoStreamCount < 20){
            this.elements["ui"]["livepreview"].querySelector("img").addEventListener("error", () => {
                // Try to reconnect
                this.elements["ui"]["livepreview"].querySelector("img").src = this.appStatus["server"]["fullURL"] + "/stream/video2";
                this.elements["ui"]["livepreview_test"].querySelector("img").src = this.appStatus["server"]["fullURL"] + "/stream/video2";
                retryVideoStreamCount++;
            });
        }else{
            this.consoleLog("「ARMMANE」 Cannot connect to video stream", "ERROR");
        }
    
    }


    
    /**
     * The handleConvStatus function is used to change the color of the icons in the status section.
     * @param conv Identify the conveyor
     * @param value Mode of the conveyor
     */
    handleConvStatus(conv, value) {
        // active = #F7496A , inactive = #FCA5B6
        // this.querySel(".status-conv00-fw").querySelector(".elementor-icon").style.backgroundColor = "#F7496A"
        // equal to this.elements["ui"]["status_conv00_forward"].querySelector(".elementor-icon").style.backgroundColor = "#F7496A"
        // fill zero
        let active = "#F7496A";
        let inactive = "#FCA5B6";
        if (conv < 10) {
            conv = "0" + conv;
        }
        let element_fw = this.elements["ui"]["status_conv" + conv + "_forward"].querySelector(".elementor-icon");
        let element_bw = this.elements["ui"]["status_conv" + conv + "_backward"].querySelector(".elementor-icon");
        let element_stop = this.elements["ui"]["status_conv" + conv + "_stop"].querySelector(".elementor-icon");

        element_fw.style.backgroundColor = inactive;
        element_bw.style.backgroundColor = inactive;
        element_stop.style.backgroundColor = inactive;

        switch (value) {
            case 0:
                element_stop.style.backgroundColor = active;
                break;
            case 1:
                element_fw.style.backgroundColor = active;
                break;
            case 2:
                element_bw.style.backgroundColor = active;
                break;
            default:
                break;
        }
        
    }

    handleCameraStatus(data) {
        let active = "#F7496A";
        let inactive = "#FCA5B6";
        let element_camera_savepower = this.elements["ui"]["status_cam_savepower"].querySelector(".elementor-icon");
        let element_camera_on = this.elements["ui"]["status_cam_enable"].querySelector(".elementor-icon");
        let element_camera_off = this.elements["ui"]["status_cam_disable"].querySelector(".elementor-icon");

        element_camera_savepower.style.backgroundColor = inactive;
        element_camera_on.style.backgroundColor = inactive;
        element_camera_off.style.backgroundColor = inactive;

        if(data["flag"] == false){
            element_camera_savepower.style.backgroundColor = active;
            element_camera_on.style.backgroundColor = inactive;
            element_camera_off.style.backgroundColor = inactive;
        }else {
            element_camera_savepower.style.backgroundColor = inactive;
        }
    }   



    
    /**
     * The handleInfStatus function is used to update the UI of the sensor status.
     * @param data Get the value and available from the data object
     */
    handleInfStatus(data) {
        let value = data["value"];
        let available = data["available"];
        // active = #F7496A , inactive = #FCA5B6
        let active = "#F7496A";
        let inactive = "#FCA5B6";
        let warning = "rgb(255 86 7)";
        let element_trigger = this.elements["ui"]["status_inf_trigger"].querySelector(".elementor-icon");
        let element_trigger_alt = this.elements["ui"]["status_inf_trigger_alt"].querySelector(".elementor-icon");
        let element_idle = this.elements["ui"]["status_inf_idle"].querySelector(".elementor-icon");
        let element_idle_alt = this.elements["ui"]["status_inf_idle_alt"].querySelector(".elementor-icon");
        if (available == 0 || available == false) {
            if (this.appStatus["sensorWarningTrigger"] == null) {
                this.appStatus["sensorWarningTrigger"] = setInterval(() => {
                    element_trigger.style.backgroundColor = warning;
                    element_trigger_alt.style.backgroundColor = warning;
                    element_idle.style.backgroundColor = warning;
                    element_idle_alt.style.backgroundColor = warning;
                    setTimeout(() => {
                        element_trigger.style.backgroundColor = inactive;
                        element_trigger_alt.style.backgroundColor = inactive;
                        element_idle.style.backgroundColor = inactive;
                        element_idle_alt.style.backgroundColor = inactive;
                    }
                    , 500);
                }, 1000);
                this.elements["text"]["test_sensor_result_title"].textContent = "ไม่ผ่าน"
                this.elements["ui"]["test_sensor_result"].style.color = "#F7496A"
                this.alertLog("เซ็นเซอร์ไม่พร้อมใช้งาน", "กรุณาตรวจสอบเซ็นเซอร์", "exclamation-triangle", "#B11D1D", 5000);
            }
            element_trigger.style.backgroundColor = inactive;
            element_trigger_alt.style.backgroundColor = inactive;
            element_idle.style.backgroundColor = inactive;
            element_idle_alt.style.backgroundColor = inactive;
        }
        else if (value == 0 || value == false) {
            if (this.appStatus["sensorWarningTrigger"] != null) {
                clearInterval(this.appStatus["sensorWarningTrigger"]);
                this.appStatus["sensorWarningTrigger"] = null;
                this.elements["text"]["test_sensor_result_title"].textContent = "ผ่าน"
                this.elements["ui"]["test_sensor_result"].style.color = "#02F51A"
            }
            element_trigger.style.backgroundColor = inactive;
            element_trigger_alt.style.backgroundColor = inactive;
            element_idle.style.backgroundColor = active;
            element_idle_alt.style.backgroundColor = active;
        }else if (value == 1 || value == true) {
            if (this.appStatus["sensorWarningTrigger"] != null) {
                clearInterval(this.appStatus["sensorWarningTrigger"]);
                this.appStatus["sensorWarningTrigger"] = null;
            }
            element_trigger.style.backgroundColor = active;
            element_trigger_alt.style.backgroundColor = active;
            element_idle.style.backgroundColor = inactive;
            element_idle_alt.style.backgroundColor = inactive;
        }else{

        }
    }

    
    /**
     * The playSound function plays a sound.
     * @param sound Pass in the sound file that is to be played
     */
    playSound(sound) {
        if(this.appStatus["soundState"] == true || this.appStatus["soundState"] == 1){
            let soundDomain = this.appStatus["soundDomain"]
            this.audio = new Audio(soundDomain + sound);
            this.audio.play();
            this.appStatus["lastSoundPlay"] = sound;
        }else{
            this.consoleLog("「ARMMANE」 Can't play sound " + sound + " because the sound is muted", "WARN");
        }
    }

    playSoundOnce(sound) {
        if(this.appStatus["soundState"]){
            if(this.appStatus["lastSoundPlay"] == sound){
                this.consoleLog("「ARMMANE」 Can't play sound " + sound + " because the sound is already played", "WARN");
            }else{
                this.playSound(sound);
            }

        }else{
            this.consoleLog("「ARMMANE」 Can't play sound " + sound + " because the sound is muted", "WARN");
        }
    }


    
    /**
     * The initializeSortable function initializes the drag and drop functionality of the command area.
     * 
     */
    initializeSortable() {
        const dragArea = document.querySelector(".ins-command-area");
        new Sortable(dragArea, {
            animation: 150,
            direction: 'vertical', // Only vertical sorting
        });
    }


    

    
    /**
     * The getData function extracts the data from each code block and returns an array of objects.
     * Each object contains the type, device, value, and speed associated with a particular code block.
     *
     * @param element_name Specify the class name of the element that contains all of the code blocks
     * @param code_block Identify the class name of the code blocks
     *
     * @return An array of objects
     *
     */
    getData(element_name="ins-command-area",code_block="tp-ins-code-block") {
        const commandArea = this.querySel("." + element_name);

        // Initialize an array to store the data
        const data = [];

        // Iterate through the child elements of command_area
        const codeBlocks = Array.from(commandArea.querySelectorAll("." + code_block));
        codeBlocks.forEach(codeBlock => {
            // Extract the data you need from each codeBlock
            const type = codeBlock.getAttribute("data-type"); // Example: "servo" or "conv"
            const device = codeBlock.getAttribute("data-device"); // Example: "servo" or "conv"
            const value = codeBlock.getAttribute("data-value"); // Example: Numeric value associated with the code block 
            const speed = codeBlock.getAttribute("data-speed"); // Example: Numeric value associated with the code block
            // Add the extracted data to the data array
            data.push({
                type,
                device,
                value,
                speed
            });
        });

        return data;
    }


    
    /**
     * The createDraggableList function creates a draggable list of functions that can be dragged into the code area.
     * 
     */
    createDraggableList() {
        const spawnArea = this.elements["ui"]["function_box"][0].querySelector("div");

        for (let i = 0; i < this.conf_list.length; i++) {
            const newDiv = this.createFunctionElement(i);

            newDiv.addEventListener("click", () => {
                this.handleFunctionElementClick(newDiv);

            });

            spawnArea.appendChild(newDiv);
        }
    }


    createFunctionElement(index) {
        const newDiv = this.elements["template"]["ins_function"][0].cloneNode(true);
        const uniqueId = `ins_function_${index}`;
        newDiv.id = uniqueId;

        newDiv.classList.add("ins_function", "" + index);
        newDiv.querySelector(".tp-ins-func > div > h4").textContent = this.conf_list[index]["type"];
        newDiv.style.display = "flex";

        newDiv.type = this.conf_list[index]["type"];
        newDiv.device = this.conf_list[index]["device"];
        newDiv.value = this.conf_list[index]["value"];
        newDiv.min = this.conf_list[index]["min"];
        newDiv.max = this.conf_list[index]["max"];
        newDiv.num = this.conf_list[index]["num"];
        newDiv.setAttribute("data-type", this.conf_list[index]["type"]);
        newDiv.setAttribute("data-device", this.conf_list[index]["device"]);
        newDiv.setAttribute("data-value", this.conf_list[index]["value"]);
        newDiv.setAttribute("data-speed", this.conf_list[index]["speed"]);
        newDiv.setAttribute("data-min", this.conf_list[index]["min"]);
        newDiv.setAttribute("data-max", this.conf_list[index]["max"]);
        newDiv.setAttribute("data-num", this.conf_list[index]["num"]);
        // newDiv.setAttribute("data-num", this.conf_list[index]["num"]);
        return newDiv;
    }


    handleFunctionElementClick(newDiv) {
        if (newDiv.type === "servo") {
            const clonedCodeBlock = this.cloneCodeBlockElement(newDiv);
            this.attachCodeBlockEventListeners(clonedCodeBlock, newDiv);
        } else if (newDiv.type === "conv") {
            const clonedCodeBlock = this.cloneCodeBlockElement(newDiv);
            clonedCodeBlock.querySelector(".cmd-text > div > h2").textContent = "setConv(0,0,0)";
            this.attachCodeBlockEventListeners(clonedCodeBlock, newDiv);
        }
    }


    cloneCodeBlockElement(newDiv) {
        const clonedCodeBlock = this.elements["template"]["code_block"].cloneNode(true);
        const codeBlockUniqueId = `code_block_${Date.now()}${Math.floor(Math.random() * 1000000)}`;
        clonedCodeBlock.id = codeBlockUniqueId;
        clonedCodeBlock.style.display = "flex";
        this.checkDragAreaEmpty();

        return clonedCodeBlock;
    }


    attachCodeBlockEventListeners(clonedCodeBlock, newDiv) {
        clonedCodeBlock.querySelector(".cmd-del").addEventListener("click", () => {
            clonedCodeBlock.remove();
            this.checkDragAreaEmpty();
        });
        clonedCodeBlock.querySelector(".cmd-edit").addEventListener("click", () => {
            this.consoleLog("「ARMMANE」 Edit command");
            this.appStatus["currentEditCodeBlock"] = clonedCodeBlock.id;
            this.openConfigBox();
        });
        clonedCodeBlock.querySelector(".cmd-play").addEventListener("click", () => {
            this.consoleLog("「ARMMANE」 Run command");
            this.appStatus["currentEditCodeBlock"] = clonedCodeBlock.id;
            this.runInstruction();
        });

        clonedCodeBlock.setAttribute("data-type", newDiv.type);
        clonedCodeBlock.setAttribute("data-device", newDiv.device);
        clonedCodeBlock.setAttribute("data-value", newDiv.value);
        clonedCodeBlock.setAttribute("data-speed", newDiv.speed);
        clonedCodeBlock.setAttribute("data-min", newDiv.min);
        clonedCodeBlock.setAttribute("data-max", newDiv.max);


        clonedCodeBlock.removeEventListener("click", () => {});

        clonedCodeBlock.addEventListener("dragstart", (e) => {
            clonedCodeBlock.classList.add("dragging");
            e.dataTransfer.setData("origin", "command_area");
        });

        clonedCodeBlock.addEventListener("dragend", () => {
            clonedCodeBlock.classList.remove("dragging");
        });

        clonedCodeBlock.draggable = true;

        const swimLane = this.elements["ui"]["command_area"][0];
        swimLane.appendChild(clonedCodeBlock);
    }

    selectAndViewById(uniqueElementId) {
        // Use querySelector to select the element by its unique ID
        const selectedElement = document.querySelector(`#${uniqueElementId}`);
    
        if (selectedElement) {
            // You can now work with the selected element
            console.log(selectedElement);
        } else {
            console.error(`Element with ID '${uniqueElementId}' not found.`);
        }
    }

    //This will change the property of the element after click save button
    openConfigBox() {
        if (this.appStatus["currentEditCodeBlock"] == null) {
            this.consoleLog("「ARMMANE」 Element not found", "ERROR");
            return;
        }
        try{
            var element = document.getElementById(this.appStatus["currentEditCodeBlock"]);
            this.consoleLog("「ARMMANE」 Open config box for " + element.id);
            if (element == null) {
                this.consoleLog("「ARMMANE」 Element + " + this.appStatus["currentEditCodeBlock"] + " not found", "ERROR");
                return;
            }
        }
        catch(err){
            this.consoleLog("「ARMMANE」 Element not found", "ERROR");
            return;
        }

        this.consoleLog("「ARMMANE」 Open config box for " + element.id);
        let type = element.getAttribute("data-type");
        if(type == "servo"){
            this.changeText("cconf_title_1", "คำสั่ง");
            this.changeText("cconf_title_2", "อุปกรณ์ที่ต้องการ");
            this.changeText("cconf_title_3", "องศา");
            this.hideElement("ui", "settingbox4");
            // Set min and max value [TODO]
            // this.elements["form"]["cconf_03"].setAttribute("min", element.getAttribute("data-min"));
            // this.elements["form"]["cconf_03"].setAttribute("max", element.getAttribute("data-max"));
        }else if(type == "conv"){
            this.changeText("cconf_title_1", "คำสั่ง");
            this.changeText("cconf_title_2", "อุปกรณ์ที่ต้องการ");
            this.changeText("cconf_title_3", "โหมด");
            this.changeText("cconf_title_4", "ความเร็ว");
            this.showElement("ui", "settingbox4");
            
            // Set min and max value [TODO]
            // this.elements["form"]["cconf_03"].setAttribute("min", element.getAttribute("data-min"));
            // this.elements["form"]["cconf_03"].setAttribute("max", element.getAttribute("data-max"));
        }
            this.elements["form"]["cconf_01"].value = element.getAttribute("data-type");
            this.elements["form"]["cconf_02"].value = element.getAttribute("data-device");
            this.elements["form"]["cconf_03"].value = element.getAttribute("data-value");
            this.elements["form"]["cconf_04"].value = element.getAttribute("data-speed");
            this.showElement("ui", "cconfbox");
    }

    createPresetButton(){
        this.getConfig();
        let config = this.config;
        array.forEach(element => {

        });
    }

    getPreset() {
        // Return the promise for the fetch operation
        return fetch(`${this.appStatus["server"]["fullURL"]}/config`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    this.consoleLog("Train request sent failed", "ERROR");
                    throw new Error("Request failed with status: " + response.status);
                }
            })
            .then((data) => {
                if (data.config && data.config.instructions) {
                    const instructions = data.config.instructions;
                    const presetNames = Object.keys(instructions);
                    const presetsWithSteps = presetNames.map(presetName => {
                        const steps = instructions[presetName].step;
                        return {
                            presetName,
                            steps
                        };
                    });
                    console.log("Presets with Steps:", presetsWithSteps);
                    return presetsWithSteps;
                } else {
                    console.error("Data format is invalid. Missing 'config' or 'instructions'.");
                    throw new Error("Data format is invalid.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                throw error;
            });
    }
    
    // Add the translateInstruction function to your class
    translateInstruction(instruction) {
        console.log("Instruction:", instruction);
        const type = instruction[0];
        if (type === 'S') {
            const id = parseInt(instruction[2]);
            const degree = parseInt(instruction.substring(4));
            return `setServo(${id},${degree});`;
        } else if (type === 'C') {
            const id = parseInt(instruction[1]);
            const degree = parseInt(instruction[3]);
            const speed = parseInt(instruction.substring(5));
            return `setConv(${id},${degree},${speed});`;
        } else {
            // Handle unsupported instruction type
            return `Unsupported instruction type: ${type}`;
        }
    }

    // Input: setServo(0,90); or setConV(0,0,0);
    //Output {type: "servo", id: 0, degree: 90, speed: 0}
    extractInstruction(instruction) {
        // check if instruction is valid
        if (instruction.startsWith("setServo(")) {
            const type = "servo";
            const id = parseInt(instruction[9]);
            const degree = parseInt(instruction.substring(11, instruction.length - 2));
            const speed = 0;
            return {
                type,
                id,
                degree,
                speed
            };
        } else if (instruction.startsWith("setConv(")) {
            const type = "conv";
            const id = parseInt(instruction[8]);
            const degree = parseInt(instruction[10]);
            const speed = parseInt(instruction.substring(12, instruction.length - 2));
            return {
                type,
                id,
                degree,
                speed
            };
        } else {
            // Handle unsupported instruction type
            return `Unsupported instruction: ${instruction}`;
        }
    }

    runInstruction() {
        var element = document.getElementById(this.appStatus["currentEditCodeBlock"]);
        console.log(element);
        let type = element.getAttribute("data-type");
        if(type == "servo"){
            this.controlServo(element.getAttribute("data-device"), element.getAttribute("data-value"));
        }
        else if(type == "conv"){
            this.controlConv(element.getAttribute("data-device"), element.getAttribute("data-value"), element.getAttribute("data-speed"));
        }
    }

    createPresetPlayList(presetsWithSteps) {
        let spawnArea = this.elements["ui"]["preset_box1"][0].querySelector("div");
        presetsWithSteps.forEach(preset => {
            let newPresetPlayElement = this.createPresetPlayElement(preset.presetName);
            newPresetPlayElement.addEventListener("click", () => {
                this.handlePresetElementPlay(preset.presetName);
            });
            spawnArea.appendChild(newPresetPlayElement);
        });
    }

    createPresetList(presetsWithSteps) {
        const spawnArea = this.elements["ui"]["preset_box2"][0].querySelector("div");
        presetsWithSteps.forEach(preset => {
            const newPresetElement = this.createPresetElement(preset.presetName);
            newPresetElement.addEventListener("click", () => {
                this.handlePresetElementClick(preset, newPresetElement);
            });
            spawnArea.appendChild(newPresetElement);
        });
    }

    createPresetPlayElement(presetName){
        const newPresetPlayElement = this.elements["template"]["ins_preset1"][0].cloneNode(true);
        const uniqueId = `preset_${presetName}`;
        newPresetPlayElement.id = uniqueId;

        newPresetPlayElement.classList.add("ins-preset", presetName);
        newPresetPlayElement.querySelector(".tp-ins-preset-1 > div > h4").textContent = presetName;
        newPresetPlayElement.style.display = "flex";
        newPresetPlayElement.setAttribute("data-preset-name", presetName);

        return newPresetPlayElement;
    }
    
    createPresetElement(presetName) {
        const newPresetElement = this.elements["template"]["ins_preset2"][0].cloneNode(true);
        const uniqueId = `preset_${presetName}`;
        newPresetElement.id = uniqueId;

        newPresetElement.classList.add("ins-preset", presetName);
        newPresetElement.querySelector(".tp-ins-preset-2 > div > h4").textContent = presetName;
        newPresetElement.style.display = "flex";
        newPresetElement.setAttribute("data-preset-name", presetName);

        return newPresetElement;
    }

    handlePresetElementPlay(presetName) {
        this.runPreset(presetName);
    };

    handlePresetElementClick(preset, newPresetElement) {
        const swimLane = this.elements["ui"]["command_area"][0];
        swimLane.innerHTML = "";
    
        preset.steps.forEach(step => {
            const newDiv = this.cloneCodeBlockElement(newPresetElement); // Pass newPresetElement as an argument
            this.attachCodeBlockEventListeners(newDiv, newPresetElement); // Pass newPresetElement as well
            let instructionText = this.translateInstruction(step);
            newDiv.querySelector(".cmd-text > div > h2").textContent = instructionText;
            // Translate the instruction to data
            let extdata = this.extractInstruction(instructionText);
            newDiv.setAttribute("data-type", extdata.type || "servo");
            newDiv.setAttribute("data-device", extdata.id || 0);
            newDiv.setAttribute("data-value", extdata.degree || 0);
            newDiv.setAttribute("data-speed", extdata.speed || 0);
            swimLane.appendChild(newDiv);
        });
    }

    runPreset(presetName){
        fetch(this.appStatus["server"]["fullURL"] + "/command/preset/" + presetName, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            this.consoleLog("「ARMMANE」 Run preset : " + presetName);
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    initializePreset() {
        // Fetch the presets and steps
        this.getPreset()
            .then(presetsWithSteps => {

            	// Remove the draggable list before creating new ones
                this.elements["ui"]["function_box"][0].querySelector("div").innerHTML = "";
                
                // Create the draggable list of elements
                this.createDraggableList();
                
                // Remove the preset list before creating new ones
                this.elements["ui"]["preset_box1"][0].querySelector("div").innerHTML = "";
                this.elements["ui"]["preset_box2"][0].querySelector("div").innerHTML = "";
    
                // Create the preset list in the preset_box
                this.createPresetList(presetsWithSteps);
                this.createPresetPlayList(presetsWithSteps);
    
                this.checkDragAreaEmpty();
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    // if dragArea is Empty then show the empty box
    checkDragAreaEmpty() {
        const dragArea = this.elements["ui"]["command_area"][0];
        const codeBlocks = Array.from(dragArea.querySelectorAll(".tp-ins-code-block"));
        if (codeBlocks.length == 0) {
            this.showElement("ui", "empty_step");
        } else {
            this.hideElement("ui", "empty_step");
        }
    }


    addDropdownItem(mode, element_name, item_name, item_value) {
        let item = document.createElement("option");
        item.value = item_value;
        item.textContent = item_name;
        this.elements[mode][element_name].appendChild(item);
    }



    clearDropdownItem(mode, element_name) {
        this.elements[mode][element_name].options.length = 0;
    }

    addModelItem() {
        this.getDataFromAPI("model").then(data => {
            for(let i = 0; i < data.length; i++) {
                this.addDropdownItem("form-field-selmodel", data[i], data[i]);
            }
        });
    }

    getConfig() {
        if (this.config.length == 0 || this.config == null || isempty(this.config)) {
            this.updateConfig();
            return this.config;
        }
        else {
            return this.config;
        }
    }

    async updateConfig() {
        (this.getDataFromAPI("config")).then(data => {
            console.log(data);
            this.config = data;
            return this.config;
        });
        }

    controlServo(servo, value) {
        // send POST api to server
        fetch(this.appStatus["server"]["fullURL"] + "/command/servo/" + servo + "/" + value, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            this.consoleLog("「ARMMANE」 Servo "+servo+" value changed to "+value);
        })
        .catch(err => {
            console.log(err);
        });
    }

    controlConv(conv, mode, speed = -1) {
        // send POST api to server
        fetch(this.appStatus["server"]["fullURL"] + "/command/conv/" + conv + "/" + mode + "/" + speed, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            this.consoleLog("「ARMMANE」 Conveyor "+conv+" mode changed to "+mode + (speed != -1 ? " with speed " + speed : ""));
        })
        .catch(err => {
            console.log(err);
        });
    }

    setBoxItem(box, item) {
        // send POST api to server
        fetch(this.appStatus["server"]["fullURL"] + "/item/" + box + "/" + item, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            this.consoleLog("「ARMMANE」 Box "+box+" item changed to "+item);
        })
        .catch(err => {
            console.log(err);
        });
    }


    async getDataFromAPI(path, value = "") {
        if(value != "") {
            this.consoleLog("「ARMMANE」 POST " + this.appStatus["server"]["fullURL"] + "/" + path + "/" + value);
            return fetch(this.serverURL + "/" + path + "/" + value, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                return data
            })
            .catch(err => {
                console.log(err);
            });
        }
        else {
            this.consoleLog("「ARMMANE」 GET " + this.serverURL + "/" + path);
            return fetch(this.serverURL + "/" + path, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                return data
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    
    /**
     * The showElement function is used to show an element in the UI.
     * 
     *
     * @param mode Determine which mode is being used
     * @param element_name Determine which element to show
     *
     * @return Nothing
     */
    showElement(mode, element_name) {
        if (!this.elements["mode"].includes(mode)) {
            this.consoleLog("「ARMMANE」 Mode " + mode + " not found", "ERROR");
            return;
        }
        this.elements[mode][element_name].style.display = "flex";
    }


    /**
     * The hideElement function is used to hide an element in the UI.
     * 
     * 
     * @param mode Determine which mode is being used
     * @param element_name Determine which element to hide
     * 
     * @return Nothing
     * 
     **/
    hideElement(mode, element_name) {
        if (!this.elements["mode"].includes(mode)) {
            this.consoleLog("「ARMMANE」 Mode " + mode + " not found", "ERROR");
            return;
        }
        this.elements[mode][element_name].style.display = "none";
    }

    reshowElement(mode, element_name) {
        if (!this.elements["mode"].includes(mode)) {
            this.consoleLog("「ARMMANE」 Mode " + mode + " not found", "ERROR");
            return;
        }
        this.elements[mode][element_name].style.display = "none";
        setTimeout(() => {
            this.elements[mode][element_name].style.display = "flex";
        }, 100);
    }

    reshowElementByTime(mode, element_name, time) {
        if (!this.elements["mode"].includes(mode)) {
            this.consoleLog("「ARMMANE」 Mode " + mode + " not found", "ERROR");
            return;
        }
        this.elements[mode][element_name].style.display = "none";
        setTimeout(() => {
            this.elements[mode][element_name].style.display = "flex";
        }, time);
    }

    hideElementByTime(mode, element_name, time) {
        if (!this.elements["mode"].includes(mode)) {
            this.consoleLog("「ARMMANE」 Mode " + mode + " not found", "ERROR");
            return;
        }
        this.elements[mode][element_name].style.display = "flex";
        setTimeout(() => {
            this.elements[mode][element_name].style.display = "none";
        }, time);
    }

    setAuto(){
        this.consoleLog("Test Mode: " + this.armStatus["mode"]);
        if(this.armStatus["mode"] == 1){
            fetch(this.appStatus["server"]["fullURL"] + "/mode/manual", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                this.consoleLog("「ARMMANE」 Mode changed to manual");
            })
            .catch(err => {
                console.log(err);
            });
        } else{
            fetch(this.appStatus["server"]["fullURL"] + "/mode/auto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                this.consoleLog("「ARMMANE」 Mode changed to auto");
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    setMode(){
        this.consoleLog("Test Detect: " + this.armStatus["sorting"]);
        if(this.armStatus["sorting"] == 1){
            fetch(this.appStatus["server"]["fullURL"] + "/command/sorting/0", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                this.consoleLog("「ARMMANE」 Mode changed to detect shape");
            })
            .catch(err => {
                console.log(err);
            });
        } else if(this.armStatus["sorting"] == 0) {
            fetch(this.appStatus["server"]["fullURL"] + "/command/sorting/1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                this.consoleLog("「ARMMANE」 Mode changed to detect color");
            })
            .catch(err => {
                console.log(err);
            });
        } else if(this.armStatus["sorting"] == 2) {
            fetch(this.appStatus["server"]["fullURL"] + "/command/sorting/0", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                this.consoleLog("「ARMMANE」 Mode changed to no mode");
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    emergency() {
        if(!this.seriStatus["emergency"]){
            fetch(this.appStatus["server"]["fullURL"] + "/command/emergency", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                this.consoleLog("「ARMMANE」 Emergency stop");
            })
            .catch(err => {
                console.log(err);
            });
        }else{
            fetch(this.appStatus["server"]["fullURL"] + "/command/unlock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            .then(data => {
                this.consoleLog("「ARMMANE」 Unlock");
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    changeText(element_name, text) {
        this.elements["text"][element_name].textContent = text;
    }

    getText(element_name) {
        return this.elements["text"][element_name].textContent;
    }

    changeIcon(element_name, icon) {
        let icon_name = "fas fa-" + icon;
        this.elements["icon"][element_name].className = icon_name;
    }

    getIcon(element_name) {
        return this.elements["icon"][element_name].className;
    }

    changeProgress(element_name, progress) {
        this.elements[element_name].style.width = progress + "%";
    }

    getProgress(element_name) {
        return this.elements[element_name].style.width;
    }


    toggleArmConfig() {
        if (this.elements["amn-config-box"].style.display == "none") {
            this.elements["amn-config-box"].style.display = "flex";
            this.elements["btn-config-inner"].style.color = "#FF006E";
            this.elements["btn-config-inner"].style.backgroundColor = "#FFFFFF";
        }
        else {
            this.elements["amn-config-box"].style.display = "none";
            this.elements["btn-config-inner"].style.color = "#FFFFFF";
            this.elements["btn-config-inner"].style.backgroundColor = "#FF006E";
        }
    }

    setSoundState() {
        this.appStatus["soundState"] = this.strToBool(this.elements["form"]["cconf_sound"].value);
        this.consoleLog("「ARMMANE」 Sound state set to " + this.appStatus["soundState"]);
    }

    getCameraList() {
        // Get camera list from api

        return fetch(this.appStatus["server"]["fullURL"] + "/camera", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status == 200) {
                response.json().then((data) => {
                    // Example data is json
                    // {
                    // "status": "success",
                    // "message": "Return current available camera",
                    // "camera": {
                    //     "0": "Camera 0"
                    // }
                    // }
                    this.clearDropdownItem("form", "camera_list");
                    for (let i = 0; i < Object.keys(data["camera"]).length; i++) {
                        this.addDropdownItem("form", "camera_list", data["camera"][i], i);
                    }
                });
            }
            else {
                this.consoleLog("Get config request sent failed", "ERROR");
            }
        });
    }

    selectCamera() {
        // send post api to server
        fetch(this.appStatus["server"]["fullURL"] + "/camera/" + this.elements["form"]["camera_list"].value, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            this.consoleLog("「ARMMANE」 Camera changed to " + this.elements["form"]["camera_list"].value);
        })
        .catch(err => {
            console.log(err);
        });
    }

    getModelList() {
        // Get model list from api
        return fetch(this.appStatus["server"]["fullURL"] + "/info", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.status == 200) {
                response.json().then((data) => {
                    this.clearDropdownItem("form", "model_list");
                    for (let i = 0; i < Object.keys(data["model"]["models"]).length; i++) {
                        this.addDropdownItem("form", "model_list", data["model"]["models"][i], data["model"]["models"][i]);
                    }
                });
            }
            else {
                this.consoleLog("Get config request sent failed", "ERROR");
            }
        });
    }

    selectModel() {
        // send post api to server
        fetch(this.appStatus["server"]["fullURL"] + "/config/currentmodel/" + this.elements["form"]["model_list"].value, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            this.consoleLog("「ARMMANE」 Model changed to " + this.elements["form"]["model_list"].value);
        })
        .catch(err => {
            console.log(err);
        });
    }

    savePower() {
        fetch(this.appStatus["server"]["fullURL"] + "/flag/not_stop_camera/toggle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            if(data["status"] == "success"){
                this.consoleLog("「ARMMANE」 Power saving mode changed");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    enableCamera() {
        fetch(this.appStatus["server"]["fullURL"] + "/camera/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            if(data["status"] == "success"){
                this.consoleLog("「ARMMANE」 Camera enabled");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    disableCamera() {
        fetch(this.appStatus["server"]["fullURL"] + "/camera/stop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            if(data["status"] == "success"){
                this.consoleLog("「ARMMANE」 Camera disabled");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    enablePredict() {
        fetch(this.appStatus["server"]["fullURL"] + "/detect/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            if(data["status"] == "success"){
                this.consoleLog("「ARMMANE」 Predict enabled");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    disablePredict() {
        fetch(this.appStatus["server"]["fullURL"] + "/detect/stop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            if(data["status"] == "success"){
                this.consoleLog("「ARMMANE」 Predict disabled");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    testServo(servo) {
        fetch(this.appStatus["server"]["fullURL"] + "/test/servo/" + servo, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
    }

    testConv(conv) {
        fetch(this.appStatus["server"]["fullURL"] + "/test/conv/" + conv, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
    }

    setCookies(name, value) {
        document.cookie = name + "=" + value + ";path=/";
    }

    getCookies(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
        else {
            return null;
        }
    }

    strToBool(string){
        if (string == "true"){
            return true;
        }else{
            return false;
        }
        
    }

    
    
    /**
     * The consoleLog function is a wrapper for the console.log function that allows you to specify
     * a type of message (INFO, SUCCESS, WARN, ERROR) and have it displayed in the console with
     * an appropriate background color. You can also specify your own custom color if you want to
     * use this function for something other than displaying messages from ArmMane. The Bold and Italic
     * parameters allow you to apply those styles as well if desired. 
     *
     * @param Text Display the text in the console (required)
     * @param Type Specify the type of log message (INFO, SUCCESS, WARN, ERROR) (optional)
     * @param Color Set the background color of the text (optional)
     * @param Bold Apply a bold style to the text (optional)
     * @param Italic Make the text italic (optional)
    consolelog(&quot;this is a test&quot;, &quot;info&quot;, &quot;green&quot;, true, true);
    
    console
     *
     * @return Undefined
     *
     */
    consoleLog(Text, Type = "", Color = "", Bold = false, Italic = false) {
        let logStyle = "";
    
        // 「ARMMANE」
        switch (Type.toUpperCase()) {
            case "INFO":
                logStyle = "background-color: #E60962; color: white;";
                break;
            case "SUCCESS":
                logStyle = "background-color: green; color: white;";
                break;
            case "WARN":
                logStyle = "background-color: orange; color: white;";
                break;
            case "ERROR":
                logStyle = "background-color: red; color: white;";
                break;
            default:
                break;
        }
    
        if (Color) {
            logStyle = `background-color: ${Color}; color: white;`;
        }
    
        // Apply Bold and Italic styles if specified
        if (Bold && Italic) {
            Text = `<b><i>${Text}</i></b>`;
        } else if (Bold) {
            Text = `<b>${Text}</b>`;
        } else if (Italic) {
            Text = `<i>${Text}</i>`;
        }
    
        const logMessage = `%c${Type ? " [" + Type + "] " : ""}${Text}`;
    
        console.log(logMessage+" ", logStyle);
    }

}

// If url not have ?elementor-preview
if (window.location.href.indexOf("?elementor-preview") == -1) {
    // Create new instance of ARMMane
    var app = new ARMMane();
}
else{
    console.log("「ARMMANE」 Development mode is enabled");
}