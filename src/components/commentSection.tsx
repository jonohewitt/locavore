// import React, { RefObject, useRef, useState } from "react"
// import styled from "styled-components"
// import { useQuery, useMutation, gql } from "@apollo/client"
// import { supabase } from "../supabaseClient"
// import useSWR from "swr"
// import { timestamp } from "../functions/timestamp"

// const CommentForm = styled.form`
//   margin-top: 20px;
// `

// const NameInput = styled.input`
//   width: 100%;
//   border: none;
//   outline: none;
//   padding: 0;
//   background: ${props => props.theme.graphBackground};
//   color: ${props => props.theme.text};
// `

// const NameContainer = styled.div<{ error: boolean }>`
//   width: 100%;
//   margin: 10px 0;
//   background: ${props => props.theme.graphBackground};
//   padding: 10px;
//   border-radius: 10px;
//   box-shadow: 0 0 15px hsla(0, 0%, 0%, 0.2);
//   ${props => props.error && "box-shadow: 0 0 10px 2px hsla(0, 95%, 70%, 1);"}

//   &:focus-within {
//     transform: scale(1.015);
//     box-shadow: 0 0 15px -5px ${props => props.theme.text};
//   }

//   transition: transform 0.2s, box-shadow 0.2s;
// `

// const CommentContainer = styled(NameContainer)`
//   min-height: 80px;
// `

// const CommentTextArea = styled.textarea`
//   width: 100%;
//   border: none;
//   outline: none;
//   padding: 0;
//   height: 100%;
//   resize: vertical;
//   min-height: 80px;
//   background: ${props => props.theme.graphBackground};
//   color: ${props => props.theme.text};
// `

// const OpenCommentFormButton = styled.button`
//   background: ${props => props.theme.settingsIcon};
//   height: 40px;
//   padding: 0 20px;
//   border-radius: 10px;
//   font-size: 18px;
//   font-weight: 600;
//   color: #fff;
//   margin: 10px 0;
//   box-shadow: 0 0 15px hsla(0, 0%, 0%, 0.2);
//   &:hover {
//     transform: scale(1.05);
//   }
//   transition: transform 0.2s;
// `
// const ButtonsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
//   grid-column-gap: 20px;
//   grid-row-gap: 10px;
//   margin: 20px 0;
// `
// const PostCommentButton = styled.button`
//   background: #5e9d62;
//   height: 40px;
//   width: 100%;
//   border-radius: 10px;
//   font-size: 21px;
//   font-weight: 600;
//   color: #fff;
//   box-shadow: 0 0 15px hsla(0, 0%, 0%, 0.2);
//   &:hover {
//     transform: scale(1.05);
//   }
//   transition: transform 0.2s;
// `

// const CancelButton = styled(PostCommentButton)`
//   background: #ca5757;
// `

// const CommentAuthor = styled.p`
//   font-weight: 700;
//   font-size: 21px;
//   margin-bottom: 0;
// `

// const CommentDate = styled.p`
//   font-size: 14px;
//   margin-bottom: 15px;
//   opacity: 0.7;
// `

// const CommentBody = styled.p`
//   margin-bottom: 5px;
//   white-space: pre-wrap;
// `

// const CommentList = styled.ul`
//   margin: 20px 0;
//   list-style: none !important;
// `

// const CommentListItem = styled.li`
//   background: ${props => props.theme.graphBackground};
//   box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
//   padding: 20px;
//   border-radius: 10px;
//   margin: 0 0 20px 0 !important;
// `

// const CommentSectionContainer = styled.section``

// const GET_COMMENTS_BY_SLUG = gql`
//   query($slug: String!) {
//     getCommentsBySlug(slug: $slug) {
//       data {
//         _ts
//         _id
//         name
//         comment
//         slug
//       }
//     }
//   }
// `

// const CREATE_COMMENT = gql`
//   mutation($name: String!, $comment: String!, $slug: String!) {
//     createComment(data: { name: $name, comment: $comment, slug: $slug }) {
//       _ts
//       _id
//       name
//       comment
//       slug
//     }
//   }
// `

// const CommentsForm = ({ slug, setCommentFormOpen }) => {
//   const nameRef = useRef<HTMLInputElement>()
//   const commentRef = useRef<HTMLTextAreaElement>()
//   const [nameError, setNameError] = useState(false)
//   const [commentError, setCommentError] = useState(false)

//   const [createComment] = useMutation(CREATE_COMMENT, {
//     update(cache, { data: { createComment } }) {
//       cache.modify({
//         fields: {
//           getCommentsBySlug(existingComments = []) {
//             const newCommentRef = cache.writeFragment({
//               data: createComment,
//               fragment: gql`
//                 fragment NewComment on Comment {
//                   data {
//                     _id
//                     name
//                     comment
//                   }
//                 }
//               `,
//             })
//             return [...existingComments.data, newCommentRef]
//           },
//         },
//       })
//     },
//   })

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault()
//     if (
//       nameRef.current.value.trim().length &&
//       commentRef.current.value.trim().length
//     ) {
//       createComment({
//         variables: {
//           name: nameRef.current.value,
//           comment: commentRef.current.value,
//           slug: slug,
//         },
//       }).catch(error => console.log(error))
//       nameRef.current.value = ""
//       commentRef.current.value = ""
//     } else {
//       if (!nameRef.current.value.trim().length) {
//         setNameError(true)
//         nameRef.current.value = ""
//         nameRef.current.placeholder = "Veuillez entrer un nom"
//       }
//       if (!commentRef.current.value.trim().length) {
//         setCommentError(true)
//         commentRef.current.value = ""
//         commentRef.current.placeholder = "Veuillez entrer un commentaire"
//       }
//     }
//   }

//   const handleCancel = () => {
//     nameRef.current.value = ""
//     commentRef.current.value = ""
//     setCommentFormOpen(false)
//   }

//   const handleInputBlur = (
//     ref: RefObject<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     ref.current.value = ref.current.value.trim()
//   }

//   return (
//     <CommentForm onSubmit={handleSubmit}>
//       <NameContainer error={nameError}>
//         <NameInput
//           placeholder="Nom..."
//           ref={nameRef}
//           onFocus={() => setNameError(false)}
//           onBlur={() => handleInputBlur(nameRef)}
//         />
//       </NameContainer>
//       <CommentContainer error={commentError}>
//         <CommentTextArea
//           placeholder="Commentaire..."
//           ref={commentRef}
//           onFocus={() => setCommentError(false)}
//           onBlur={() => handleInputBlur(commentRef)}
//         />
//       </CommentContainer>

//       <ButtonsContainer>
//         <PostCommentButton type="submit">Poster</PostCommentButton>
//         <CancelButton onClick={handleCancel}>Annuler</CancelButton>
//       </ButtonsContainer>
//     </CommentForm>
//   )
// }

// const tsToLocaleDate = (ts: number) =>
//   new Date(ts / 1000).toLocaleDateString("fr", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   })

// const CommentsList = ({ slug }: { slug: string }) => {
//   interface Comment {
//     id: number
//     user_id: string
//     username: string
//     comment_text: string
//     slug: string
//     date_added: string
//   }

//   const { data: comments, error: commentsError } = useSWR(
//     slug,
//     async () =>
//       await supabase
//         .from("recipe_comments")
//         .select("id, user_id, comment_text, date_added, username")
//         .order("id", { ascending: false })
//         .eq("recipe_slug", slug)
//         .then(res => res.data as Comment[])
//   )

//   const loading = !comments && !commentsError

//   if (loading) {
//     return <p>Chargement...</p>
//   } else if (commentsError) {
//     console.log(commentsError)
//     return <p>Erreur</p>
//   } else {
//     return (
//       <CommentList>
//         {comments.map(comment => (
//           <CommentListItem key={comment.id}>
//             <CommentAuthor>{comment.username}</CommentAuthor>
//             <CommentDate title={timestamp(comment.date_added)}>
//               {timestamp(comment.date_added, { vague: true })}
//             </CommentDate>
//             <CommentBody>{comment.comment_text}</CommentBody>
//           </CommentListItem>
//         ))}
//       </CommentList>
//     )
//   }
// }

// interface CommentSectionComponent {
//   slug: string
//   commentFormOpen: boolean
//   setCommentFormOpen: Function
// }

// export const CommentSectionComponent = ({
//   slug,
//   commentFormOpen,
//   setCommentFormOpen,
// }: CommentSectionComponent) => {
//   return (
//     <CommentSectionContainer>
//       <h2>Commentaire</h2>
//       <hr />
//       {commentFormOpen ? (
//         <CommentsForm slug={slug} setCommentFormOpen={setCommentFormOpen} />
//       ) : (
//         <OpenCommentFormButton onClick={() => setCommentFormOpen(true)}>
//           Laisser un commentaire
//         </OpenCommentFormButton>
//       )}
//       <hr />
//       <CommentsList slug={slug} />
//     </CommentSectionContainer>
//   )
// }
