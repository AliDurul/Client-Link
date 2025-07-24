import mongoose, { Document, Schema, Model } from "mongoose";

const faqSchema: Schema<IFaq> = new Schema({

    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true
    }

}, {
    collection: 'Faqs',
    timestamps: true
});


const Faq: Model<IFaq> = mongoose.model<IFaq>('Faq', faqSchema);
export default Faq;

export interface IFaq extends Document {
    question: string;
    answer: string;
}
