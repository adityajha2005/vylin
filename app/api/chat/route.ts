import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
export const runtime="nodejs";

const ChatSchema = z.object({
    question: z.string().min(1).max(500),
    mode: z.enum(["normal","research"]).default("normal"),
})

export async function POST(req: Request){
    try{
        const body = await req.json();
        const {question,mode}=ChatSchema.parse(body);
        return NextResponse.json({
            ok:true,
            app:"Vylin",
            message:"its live"
        });
    }
    catch(e){
        return NextResponse.json(
            {
                error:"invalid request",
            },
            {status:400}
        );
    }
}