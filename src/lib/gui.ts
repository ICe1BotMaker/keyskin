import { QLabel, QMainWindow, FlexLayout, QWidget } from '@nodegui/nodegui';
import osu from 'node-os-utils';
import os from 'os';
import fs from 'fs';


/* window */
const win = new QMainWindow();

win.setInlineStyle(`background: white;`);
win.setStyleSheet(`font-family: 'Pretendard'; font-weight: 400;`);
win.setWindowTitle(`Keyskin`);
win.setFixedSize(925, 750);


/* title description */
const widget1 = new QWidget();
widget1.setInlineStyle(`padding: 25px;`);

const layout1 = new FlexLayout(widget1);

const title1 = new QLabel();
title1.setText(`Monitoring`);
title1.setInlineStyle(`color: #000000; font-size: 18px; font-weight: 600;`);
layout1.addWidget(title1);

const description1 = new QLabel();
description1.setText(`Easy and fast express monitoring.`);
description1.setInlineStyle(`color: #000000; font-size: 16px;`);
layout1.addWidget(description1);

win.setMenuWidget(widget1);


/* info */
const widget2 = new QWidget();

const widget3 = new QWidget(widget2);
widget3.move(25, 0);
widget3.setFixedSize(200, 200);
widget3.setInlineStyle(`border: 1px solid black; background: rgba(63, 114, 175, 0.1); padding: 25px;`);

const widget3_detail = new QWidget(widget3);
widget3_detail.setFixedSize(200, 200);
widget3_detail.setInlineStyle(`background: white; padding: 25px; border: 1px solid black;`);

const widget3_detail_layout = new FlexLayout(widget3);

const widget3_detail_usage = new QLabel();
widget3_detail_usage.setInlineStyle(`color: black; font-size: 18px;`);
widget3_detail_usage.setText(`Usage: 000.0%`);
widget3_detail_layout.addWidget(widget3_detail_usage);

const widget3_detail_free = new QLabel();
widget3_detail_free.setInlineStyle(`color: black; font-size: 18px;`);
widget3_detail_free.setText(`Free: 000.0%`);
widget3_detail_layout.addWidget(widget3_detail_free);

const widget3_title = new QLabel();
widget3_title.setInlineStyle(`font-size: 12px; color: black; margin-top: 5px;`);
widget3_title.setText(`[ CPU ]`);
widget3_detail_layout.addWidget(widget3_title);


const widget4 = new QWidget(widget2);
widget4.move(250, 0);
widget4.setFixedSize(200, 200);
widget4.setInlineStyle(`border: 1px solid black; background: rgba(63, 114, 175, 0.1); padding: 25px;`);

const widget4_detail = new QWidget(widget4);
widget4_detail.setFixedSize(200, 200);
widget4_detail.setInlineStyle(`background: white; padding: 25px; border: 1px solid black;`);

const widget4_detail_layout = new FlexLayout(widget4);

const widget4_detail_used = new QLabel();
widget4_detail_used.setInlineStyle(`color: black; font-size: 18px;`);
widget4_detail_used.setText(`Used: 00000000`);
widget4_detail_layout.addWidget(widget4_detail_used);

const widget4_detail_free = new QLabel();
widget4_detail_free.setInlineStyle(`color: black; font-size: 18px;`);
widget4_detail_free.setText(`Free: 00000000`);
widget4_detail_layout.addWidget(widget4_detail_free);

const widget4_title = new QLabel();
widget4_title.setInlineStyle(`font-size: 12px; color: black; margin-top: 5px;`);
widget4_title.setText(`[ MEMORY ]`);
widget4_detail_layout.addWidget(widget4_title);


const widget5 = new QWidget(widget2);
widget5.move(475, 0);
widget5.setFixedSize(425, 200);
widget5.setInlineStyle(`border: 1px solid black;`);

const widget5_detail = new QWidget(widget5);
widget5_detail.setFixedSize(425, 200);
widget5_detail.setInlineStyle(`background: white; padding: 25px; border: 1px solid black;`);

const widget5_detail_layout = new FlexLayout(widget5_detail);

const widget5_detail_platform = new QLabel();
widget5_detail_platform.setInlineStyle(`color: black; font-size: 18px;`);
widget5_detail_platform.setText(`testtesttesttesttesttesttesttesttest`);
widget5_detail_layout.addWidget(widget5_detail_platform);

const widget5_detail_hostname = new QLabel();
widget5_detail_hostname.setInlineStyle(`color: black; font-size: 18px;`);
widget5_detail_hostname.setText(`testtesttesttesttesttesttesttesttest`);
widget5_detail_layout.addWidget(widget5_detail_hostname);


const widget6 = new QWidget(widget2);
widget6.move(25, 225);
widget6.setFixedSize(875, 400);
widget6.setInlineStyle(`border: 1px solid black; background: white; padding: 25px;`);

const widget6_layout = new FlexLayout(widget6);

const widget6_texts: QLabel[] = [];
for (let i = 0; i < 17; i++) {
    const widget6_text = new QLabel();
    widget6_text.setInlineStyle(`color: black; font-size: 16px;`);
    widget6_text.setText(`                                                                            `);
    widget6_text.setObjectName(`logtext-${i}`);
    widget6_layout.addWidget(widget6_text);
    widget6_texts.push(widget6_text);
}


setInterval(async () => {
    const cpuUsage = await osu.cpu.usage();
    const cpuFree = await osu.cpu.free();

    widget3_detail_usage.setText(`Usage: ${cpuUsage}%`);
    widget3_detail_free.setText(`Free: ${cpuFree}%`);

    widget3_detail.setFixedSize(200, cpuFree * 2);


    const memUsed = await osu.mem.used();
    const memFree = await osu.mem.free();

    widget4_detail_used.setText(`Used: ${memUsed.usedMemMb}`);
    widget4_detail_free.setText(`Free: ${memFree.freeMemMb}`);

    const memCalc = (memFree.freeMemMb / memFree.totalMemMb) * 100;

    widget4_detail.setFixedSize(200, memCalc * 2);


    widget5_detail_platform.setText(`Platform: ${os.platform()}`);
    widget5_detail_hostname.setText(`Hostname: ${os.hostname()}`);


    widget6_texts.forEach((widget6_text, idx) => {
        const config: { latest: string } = JSON.parse(fs.readFileSync(`./log/config.json`, `utf-8`));
        const log = fs.readFileSync(`./log/${config.latest}`, `utf-8`);
        
        const logln = log.split(`\n`);
        const logtext = logln[logln.length - idx];

        widget6_text.setText(`${logtext === undefined ? `` : logtext }`);
    });
}, 25);


win.setCentralWidget(widget2);


/* latest */
win.show();

(global as any).win = win;