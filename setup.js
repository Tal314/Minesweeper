class Setup {
    constructor(height, width, mines) {
        this.height = height;
        this.width = width;
        this.mines = mines;
    }
}

const Expert = new Setup(16, 30, 99);
const Intermediate = new Setup(16, 16, 30);
const Beginner = new Setup(9, 9, 10);