
module.exports = {
    templateModel: `
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Roboto&display=swap');

            body {
                font-family: Gotham, 'Helvetica Neue', Helvetica, Arial, sans-serif;
                background-color: #008080;
                margin: 0;
                padding: 0;
                color: #333333;
            }

            h1 {
                margin: 30px 30px 13px;
                text-align: center;
                text-transform: uppercase;
                font-size: 15px;
                line-height: 30px;
                font-weight: bold;
                color: #484a42;
            }

            h2 {
                margin: 10px 0;
                text-align: center;
                text-transform: uppercase;
                font-size: 12px;
                font-weight: bold;
                color: #484a42;
            }

            h3 {
                margin: 10px 0;
                text-align: center;
                text-transform: uppercase;
                font-size: 10px;
                font-weight: bold;
                color: #484a42;
            }

            h4,
            h5,
            h6 {
                margin: 10px 0;
                text-align: center;
                text-transform: uppercase;
                font-size: 8px;
                font-weight: bold;
                color: #484a42;
            }

            strong {
                color: #484a42;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                font-family: 'Roboto', sans-serif !important;
                margin: 15px auto;
            }

            p {
                text-align: justify
            }


            div,
            strong,
            ul,
            li {
                font-family: 'Open Sans', sans-serif;
                font-size: 10px !important;
                line-height: 18px !important;
                color: #333333 !important;
            }


            ul li,
            ol li {
                padding: 5px 0;
            }

            button,
            p.title {
                margin: 15px 0;
            }
        </style>
    </head>

    <body style="">

        <table width="100%" bgcolor="#008080" cellpadding="0" cellspacing="0" border="0">
            <tbody>
                <tr>
                    <td style="padding:40px 0;">
                        <!-- begin main block -->
                        <table cellpadding="0" cellspacing="0" width="608" border="0" align="center">
                            <tbody>
                                <tr>
                                    <td>
                                        <!-- begin wrapper -->
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td width="8" height="4" colspan="2">&nbsp;</p>
                                                    </td>
                                                    <td height="4">
                                                        <p style="margin:0; font-size:1px; line-height:1px;">&nbsp;</p>
                                                    </td>
                                                    <td width="8" height="4" colspan="2">&nbsp;</p>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td width="4" height="4">&nbsp;</p>
                                                    </td>
                                                    <td colspan="3" rowspan="3" bgcolor="#FFFFFF" style="padding:0 0 30px;">
                                                        <!-- begin content -->
                                                        <h1>
                                                            {title}
                                                        </h1>
                                                        <!-- begin articles -->
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tbody>

                                                                <tr valign="top">
                                                                    <td width="30">
                                                                        <p
                                                                            style="margin:0; font-size:1px; line-height:1px;">
                                                                            &nbsp;</p>
                                                                    </td>
                                                                    <td colspan="3">
                                                                        <p>{message}</p>
                                                                    </td>
                                                                    <td width="30" height="4">&nbsp;</p>
                                                                    </td>
                                                                </tr>


                                                                <tr>
                                                                    <td width="4">&nbsp;</p>
                                                                    </td>
                                                                    <td width="4">
                                                                        <p
                                                                            style="margin:0; font-size:1px; line-height:1px;">
                                                                            &nbsp;</p>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td width="4" height="4">&nbsp;</p>
                                                                    </td>
                                                                    <td width="4" height="4">
                                                                        <p
                                                                            style="margin:0; font-size:1px; line-height:1px;">
                                                                            &nbsp;</p>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td width="4" height="4">
                                                                        <p
                                                                            style="margin:0; font-size:1px; line-height:1px;">
                                                                            &nbsp;</p>
                                                                    </td>
                                                                    <td width="4" height="4">&nbsp;</p>
                                                                    </td>
                                                                    <td height="4">
                                                                        <p
                                                                            style="margin:0; font-size:1px; line-height:1px;">
                                                                            &nbsp;</p>
                                                                    </td>
                                                                    <td width="4" height="4">&nbsp;</p>
                                                                    </td>
                                                                    <td width="4" height="4">
                                                                        <p
                                                                            style="margin:0; font-size:1px; line-height:1px;">
                                                                            &nbsp;</p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!-- end wrapper-->
                                                        <p
                                                            style="margin:0; padding:34px 0 0; text-align:center; font-size:11px; line-height:13px; color:#333333;">

                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!-- end main block -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
    </body>

    </html>
    `
}
