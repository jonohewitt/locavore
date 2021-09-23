import { useState } from "react"
import { supabase } from "../supabaseClient"
import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"

export default async function handleUser(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  const { data: identity, error } = await supabase
    .from("user_info")
    .select("username, user_id")
    .single()
  if (error) console.log("error", error)
  else res.json(identity)
}
