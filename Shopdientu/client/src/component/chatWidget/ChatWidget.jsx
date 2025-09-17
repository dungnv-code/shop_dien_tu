import { useEffect } from "react";

const ChatWidget = () => {
    useEffect(() => {
        // Tạo div chat nếu chưa có
        if (!document.getElementById("fb-root")) {
            const fbRoot = document.createElement("div");
            fbRoot.id = "fb-root";
            document.body.appendChild(fbRoot);
        }

        if (!document.getElementById("fb-customer-chat")) {
            const chatDiv = document.createElement("div");
            chatDiv.id = "fb-customer-chat";
            chatDiv.className = "fb-customerchat";
            chatDiv.setAttribute("page_id", "YOUR_PAGE_ID"); // thay bằng page ID
            chatDiv.setAttribute("attribution", "biz_inbox");
            document.body.appendChild(chatDiv);
        }

        // Load Facebook SDK
        if (!document.getElementById("facebook-jssdk")) {
            const js = document.createElement("script");
            js.id = "facebook-jssdk";
            js.src = "https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js";
            document.body.appendChild(js);
        }

        // Khởi tạo FB
        window.fbAsyncInit = function () {
            window.FB.init({
                xfbml: true,
                version: "v19.0",
            });
        };
    }, []);

    return null;
};

export default ChatWidget;
