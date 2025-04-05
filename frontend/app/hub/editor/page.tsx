// app/articles/page.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// import TextEditor from "@/components/TextEditor"

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  category: z.string().min(1, "Choisissez une catégorie"),
  visibility: z.enum(["public", "private"]),
  date: z.date({ required_error: "La date est requise" }),
})

export default function ArticleFormPage() {
  const [editorContent, setEditorContent] = useState("")
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visibility: "public",
      category: "Actualités",
    },
  })

  const onSubmit = (data: any) => {
    const fullData = { ...data, content: editorContent }
    console.log(fullData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input id="title" placeholder="Titre de l'article" {...register("title")} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <Label>Catégorie</Label>
        <Select
          defaultValue="Actualités"
          onValueChange={(val) => setValue("category", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisissez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Actualités">Actualités</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="France">France</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Calendar
          mode="single"
          selected={watch("date")}
          onSelect={(date) => date && setValue("date", date)}
        />
        {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
      </div>

      <div>
        <Label>Visibilité</Label>
        <RadioGroup
          defaultValue="public"
          onValueChange={(val: string) => setValue("visibility", val as "public" | "private")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Public</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">Privé</Label>
          </div>
        </RadioGroup>
        {errors.visibility && <p className="text-sm text-red-500">{errors.visibility.message}</p>}
      </div>

      <div>
        <Label>Contenu</Label>
        {/* <TextEditor value={editorContent} onChange={setEditorContent} /> */}
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
      </div>

      <Button type="submit">Publier</Button>
    </form>
  )
}
