import { QMainWindow, QSlider } from '@nodegui/nodegui';

const win = new QMainWindow();

win.setWindowTitle(`game`);
win.setFixedSize(100, 100);
win.move(0, 0);

const range = new QSlider();
range.show();

let winRotate = [`+`, `+`];
setInterval(() => {
    let gameContainer = { width: 1920 * 2, heigth: 1080 };
    let winSpeed = range.value();

    win.move(eval(`${win.x()} ${winRotate[0]} ${winSpeed}`), eval(`${win.y()} ${winRotate[1]} ${winSpeed}`));

    if (win.x() <= (gameContainer.width - 100) && win.x() >= (gameContainer.width - 100) - winSpeed) {
        win.setStyleSheet(`background: rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)});`);
        winRotate[0] = `-`;
    }

    if (win.y() <= (gameContainer.heigth - 100) && win.y() >= (gameContainer.heigth - 100) - winSpeed) {
        win.setStyleSheet(`background: rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)});`);
        winRotate[1] = `-`;
    }

    if (win.x() >= 0 && win.x() <= winSpeed) {
        win.setStyleSheet(`background: rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)});`);
        winRotate[0] = `+`;
    }

    if (win.y() >= 0 && win.y() <= winSpeed) {
        win.setStyleSheet(`background: rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)});`);
        winRotate[1] = `+`;
    }
});

win.show();

(global as any).win = win;