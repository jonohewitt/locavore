import { useState } from "react"
import { supabase } from "../supabaseClient"
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"

interface Comment {
  text: string
  user_id: string
  recipe_slug: string
}

export default async function handleComments(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method === "POST") {
    const comment: Comment = req.body
    const { error } = await supabase
      .from("recipe_comments")
      .insert({
        comment_text: comment.text,
        user_id: comment.user_id,
        recipe_slug: comment.recipe_slug,
      })
      .single()
    if (error) res.status(418).send({ error: error })
    else
      res.status(201).send({
        message: `Comment added to ${comment.recipe_slug}`,
      })
  } else {
    const { data: comments, error } = await supabase
      .from("recipe_comments")
      .select("id, user_id, comment_text, date_added")
      .order("id", { ascending: false })
      .eq("recipe_slug", req.query.recipe)
    if (error) console.log("error", error)
    else res.json(comments)
  }
}
