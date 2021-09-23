import React, { useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import useSWR, { mutate } from "swr"
import { useNewContext } from "../context/newContext"
import { getTimestamp } from "../functions/getTimestamp"
import { supabase } from "../supabaseClient"

interface Comment {
  id: number
  user_id: string
  comment_text: string
  slug: string
  date_added: string
  public_user_info: {
    username: string
  }
}

interface CommentSection {
  comments: Comment[]
  commentsLoading: boolean
  commentsOpenRef: React.MutableRefObject<boolean>
  slug: string
}

interface User {
  username: string
  user_id: string
}

export const CommentSectionComponent = ({
  comments,
  commentsLoading,
  commentsOpenRef,
  slug,
}: CommentSection) => {
  const commentRef = useRef<HTMLTextAreaElement>()
  const [commentError, setCommentError] = useState(false)
  const [commentFormOpen, setCommentFormOpen] = useState(
    commentsOpenRef.current
  )

  const {
    state: { session, username },
  } = useNewContext()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (session) {
      if (commentRef.current.value.trim().length) {
        mutate(
          slug,
          [
            {
              id: "unvalidated",
              user_id: session.user.id,
              public_user_info: {
                username: username,
              },
              comment_text: commentRef.current.value,
              date_added: new Date(),
            },
            ...comments,
          ],
          false
        )

        await supabase.from("recipe_comments").insert({
          comment_text: commentRef.current.value,
          user_id: session.user.id,
          recipe_slug: slug,
        })

        mutate(slug)
      } else {
        if (!commentRef.current.value.trim().length) {
          setCommentError(true)
          commentRef.current.value = ""
          commentRef.current.placeholder = "Veuillez entrer un commentaire"
        }
      }
    } else {
      setCommentError(true)
      commentRef.current.value = ""
      commentRef.current.placeholder = "Please sign in first!"
    }
  }

  const handleCancel = () => {
    commentRef.current.value = ""
    setCommentFormOpen(false)
    commentsOpenRef.current = false
  }

  const Comment = ({ comment }: { comment: Comment }) => {
    const editRef = useRef<HTMLTextAreaElement>()
    const [editing, setEditing] = useState(false)
    const [timestamp, setTimestamp] = useState(
      getTimestamp(comment.date_added, { vague: true })
    )

    let updateCommentTime: NodeJS.Timeout

    const updateTime = () => {
      const commentAge = Date.now() - Date.parse(comment.date_added)
      setTimestamp(getTimestamp(comment.date_added, { vague: true }))
      if (commentAge < 1000 * 60 * 2) {
        updateCommentTime = setTimeout(updateTime, 1000 * 10)
      } else {
        updateCommentTime = setTimeout(updateTime, 1000 * 60)
      }
    }

    useEffect(() => {
      updateTime()
      return () => clearTimeout(updateCommentTime)
    }, [])

    const handleSaveEdit = async (id: number) => {
      mutate(
        slug,
        comments.map(comment => {
          if (comment.id === id) {
            comment.comment_text = editRef.current.value
          }
          return comment
        }),
        false
      )
      await supabase
        .from("recipe_comments")
        .update({ comment_text: editRef.current.value })
        .eq("id", id)

      mutate(slug)
      setEditing(false)
    }

    const handleDelete = async (id: number) => {
      mutate(slug, [...comments.filter(comment => comment.id !== id)], false)
      await supabase.from("recipe_comments").delete().match({ id: id })
      mutate(slug)
    }

    const EditComment = () => {
      useEffect(() => {
        const length = editRef.current.value.length
        editRef.current.focus()
        editRef.current.setSelectionRange(length, length)
      }, [])
      return <CommentEditor ref={editRef} defaultValue={comment.comment_text} />
    }

    return (
      <CommentListItem>
        <CommentAuthor>{comment.public_user_info.username}</CommentAuthor>
        <CommentDate title={getTimestamp(comment.date_added)}>
          {timestamp}
        </CommentDate>
        {editing ? (
          <CommentEditorContainer>
            <EditComment />
          </CommentEditorContainer>
        ) : (
          <CommentBody>{comment.comment_text}</CommentBody>
        )}
        {comment.user_id === supabase.auth.user()?.id && (
          <>
            <hr />
            {editing ? (
              <>
                <button onClick={() => handleSaveEdit(comment.id)}>Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}>Edit</button>
            )}

            <button onClick={() => handleDelete(comment.id)}>Delete</button>
          </>
        )}
      </CommentListItem>
    )
  }

  return (
    <CommentSectionContainer>
      <h2>Commentaire</h2>
      <hr />
      {commentFormOpen ? (
        <CommentForm onSubmit={handleSubmit}>
          <CommentContainer error={commentError}>
            <CommentTextArea
              placeholder="Commentaire..."
              ref={commentRef}
              onFocus={() => setCommentError(false)}
              onBlur={() => {
                commentRef.current.value = commentRef.current.value.trim()
              }}
            />
          </CommentContainer>

          <ButtonsContainer>
            <CancelButton onClick={handleCancel}>
              Annuler
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </CancelButton>
            <PostCommentButton type="submit">
              Poster{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22 11 13 2 9 22 2z" />
              </svg>
            </PostCommentButton>
          </ButtonsContainer>
        </CommentForm>
      ) : (
        <OpenCommentFormButton
          onClick={() => {
            setCommentFormOpen(true)
            commentsOpenRef.current = true
          }}
        >
          Laisser un commentaire
        </OpenCommentFormButton>
      )}
      <hr />
      {commentsLoading ? (
        <p>Chargment...</p>
      ) : (
        <CommentList>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </CommentList>
      )}
    </CommentSectionContainer>
  )
}

const CommentForm = styled.form`
  margin-top: 20px;
`

const NameContainer = styled.div<{ error: boolean }>`
  width: 100%;
  margin: 10px 0;
  background: ${props => props.theme.graphBackground};
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 15px hsla(0, 0%, 0%, 0.2);
  ${props => props.error && "box-shadow: 0 0 10px 2px hsla(0, 95%, 70%, 1);"}

  &:focus-within {
    transform: scale(1.015);
    box-shadow: 0 0 15px -5px ${props => props.theme.text};
  }

  transition: transform 0.2s, box-shadow 0.2s;
`

const CommentContainer = styled(NameContainer)`
  min-height: 80px;
`

const CommentTextArea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  padding: 0;
  height: 100%;
  resize: vertical;
  min-height: 80px;
  background: ${props => props.theme.graphBackground};
  color: ${props => props.theme.text};
`

const OpenCommentFormButton = styled.button`
  background: ${props => props.theme.settingsIcon};
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 10px 0;
  box-shadow: 0 0 15px hsla(0, 0%, 0%, 0.2);
  &:hover {
    transform: scale(1.05);
  }
  transition: transform 0.2s;
`
const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  grid-column-gap: 20px;
  grid-row-gap: 10px;
  margin: 15px 0 20px 0;
`
const PostCommentButton = styled.button`
  background: #5e9d62;
  height: 40px;
  width: 100%;
  border-radius: 10px;
  font-size: 21px;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 0 15px hsla(0, 0%, 0%, 0.2);
  &:hover {
    transform: scale(1.05);
  }
  transition: transform 0.2s;

  svg {
    height: 18px;
  }
`

const CancelButton = styled(PostCommentButton)`
  background: #ca5757;
  svg {
    margin-left: 5px;
  }
`

const CommentAuthor = styled.p`
  font-weight: 700;
  font-size: 21px;
  margin-bottom: 0;
`

const CommentDate = styled.p`
  font-size: 14px;
  margin-bottom: 15px;
  opacity: 0.7;
`

const CommentBody = styled.p`
  margin-bottom: 5px;
  white-space: pre-wrap;
`

const CommentList = styled.ul`
  margin: 20px 0;
  list-style: none !important;
`

const CommentListItem = styled.li`
  background: ${props => props.theme.graphBackground};
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 10px;
  margin: 0 0 20px 0 !important;
`

const CommentSectionContainer = styled.section``

const CommentEditor = styled.textarea`
  width: 100%;
  border: 0;
  outline: none;
  padding: 0;
  height: 100%;
  resize: vertical;
  min-height: 30px;
  background: ${props => props.theme.graphBackground};
  color: ${props => props.theme.text};
`
const CommentEditorContainer = styled.div`
  border: 1px solid ${props => props.theme.text};
  border-radius: 10px;
  padding: 10px;

  &:focus-within {
    box-shadow: 0 0 15px -5px ${props => props.theme.text};
  }
`
