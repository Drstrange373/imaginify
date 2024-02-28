// this model is purly for testing and it will be deleted or left without any use

import mongoose from "mongoose";

const testSchema = new mongoose.Schema({testdata:String})

const Test = mongoose.models.Test || mongoose.model("Test", testSchema)

export default Test