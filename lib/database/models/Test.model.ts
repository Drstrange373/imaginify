import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    testdata:String
})

const TestModel = mongoose.models.Test|| mongoose.model('Test', testSchema)
export default TestModel