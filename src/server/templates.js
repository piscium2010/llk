const templates = {
    notification: `
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
    <title>Message</title>
    <style type="text/css">
        body {
            height:600px;
            background: #2a2a2a;
            font-family: 'proxima_nova_rgregular', Helvetica
        }

        .container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .notification {
            margin: 20vh auto auto;
            padding: 30px;
            width: 300px;
            height: 300px;
            background: orange;
            border-radius: 15px;
            color: #fff;
            font-size: 15px;
        }

        p {
            font-size: 15px;
        }
    </style>

    <body>
        <div class='container'>
            <div class='notification'>{$content}</div>
        </div>
    </body>

</html>`
}

export default templates