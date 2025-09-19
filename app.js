//Base Question Class
class Question {
    constructor(id, text, point = 1){
        this._id = id;
        this._text = text
        this._point = point;
    }

    get id(){
        return this._id;
    }

    set id(id){
        this._id = id;
    }

    set text(text){
        this._text = text
    }

    get text(){
        return this._text;
    }

    get points(){
        return this._point;
    }

    checkAnswer(answer){
        throw new Error("Method must be implemented");
    }

    displayOptions(container){
        throw new Error("Method must be implemented");
    }
}