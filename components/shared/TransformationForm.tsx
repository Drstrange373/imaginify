"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { Form } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { Button } from "../ui/button"
import { updateCredits } from "@/lib/actions/user.action"
import MediaUploader from "./MediaUploader"

export const formSchema = z.object({
    title: z.string(),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string()
})




export default function TransformationForm({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) {

    const [image, setImage] = useState(data)
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isTransforming, setIsTransforming] = useState(false)
    const [transformationConfig, setTransformationConfig] = useState(config)
    const [isPending, startTransition] = useTransition()

    const initialValues = data && action === 'Update' ? {
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
    } : defaultValues
    const transformationType = transformationTypes[type]


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    function onSelectFieldHandler(value: string, onFiledChange: (value: string) => undefined) {
        const imageSize = aspectRatioOptions[value as AspectRatioKey]
        setImage((prevState: any) => ({
            ...prevState,
            aspectRatio: imageSize.aspectRatio,
            width: imageSize.width,
            height: imageSize.height
        }))

        setNewTransformation(transformationType.config)
        return onFiledChange(value)

    }

    function onInputChangeHandler(fieldName: string, value: string, type: string, onChangeField: (value: string) => void) {
        debounce(() => {
            setNewTransformation((prevState: any) => ({
                ...prevState,
                [type]: {
                    ...prevState?.[type],
                    [fieldName === 'prompt' ? 'prompt' : 'to']: value
                }
            }))
            onChangeField(value)
        }, 1000)
    }


    async function onTransformHandler() {
        setIsTransforming(true)
        setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig))
        setNewTransformation(null)
        startTransition(async () => {
            // await updateCredits(userId, creditFee)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <CustomField
                    control={form.control}
                    name="title"
                    formLabel="Image title"
                    className="w-full"
                    render={({ field }) => <Input className="input-field" {...field} />}
                />

                {type === 'fill' &&
                    <CustomField
                        control={form.control}
                        name="aspectRatio"
                        formLabel="Aspect Ratio"
                        className="w-full"
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                            >
                                <SelectTrigger className="select-field">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(aspectRatioOptions).map(option =>
                                        <SelectItem key={option} className="select-item" value={option}>
                                            {aspectRatioOptions[option as AspectRatioKey].label}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>

                        )}


                    />
                }

                {(type === 'remove' || type === 'recolor') && (
                    <div className="prompt-field">
                        <CustomField
                            control={form.control}
                            name="prompt"
                            formLabel={type === 'remove' ? 'Object to remove' : 'Object to recolor'}
                            className="w-full"
                            render={({ field }) => (
                                <Input
                                    value={field.value}
                                    className="input-field"
                                    onChange={(e) => onInputChangeHandler('prompt', e.target.value, type, field.onChange)}
                                />
                            )}
                        />

                        {type === 'recolor' && (
                            <CustomField
                                control={form.control}
                                name="color"
                                formLabel="Replacement Color"
                                className="w-full"
                                render={({ field }) => (
                                    <Input
                                        value={field.value}
                                        className="input-field"
                                        onChange={(e) => onInputChangeHandler('color', e.target.value, 'recolor', field.onChange)}
                                    />
                                )}
                            />
                        )}
                    </div>
                )}

                <div className="media-uploader-field">
                    <CustomField
                        control={form.control}
                        name="publicId"
                        className="flex size-full flex-col"
                        render={({ field }) => (
                            <MediaUploader
                                onValueChange={field.onChange}
                                setImage={setImage}
                                publicId={field.value}
                                image={image}
                                type={type}
                            />
                        )}
                    />
                </div>

                <div className="flex flex-col gap-4">

                    <Button
                        type="button"
                        disabled={isTransforming || newTransformation === null}
                        onClick={onTransformHandler}
                        className="submit-button disabled:cursor-not-allowed capitalize"
                    >{isTransforming ? 'Transforming...' : 'Apply transformation'}</Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="submit-button disabled:cursor-not-allowed capitalize"
                    >{isSubmitting ? 'Submitting...' : 'Save Image'}</Button>
                </div>


            </form>
        </Form>
    )
}
