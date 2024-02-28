import TestModel from "@/lib/database/models/Test.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await connectToDatabase()
    const requestBody = await request.json()
    try {
        const testData = await TestModel.create({
            testdata: JSON.stringify(requestBody)
        })
        
        return NextResponse.json({ message: "All good", testData})
    } catch (error:any) {
        console.log(error.message)
        return NextResponse.json({ error, message: "All good🤣🤣🤣" }, { status: 200 })
    }
}