import { useCMS, useLocalForm, useWatchFormValues } from 'react-tinacms'

export default function useRemarkForm( markdownRemark, formOverrides ) {

  if (!markdownRemark || process.env.NODE_ENV === 'production') {
    return [markdownRemark, null]
  }
   // TINA CMS Config ---------------------------
   const cms = useCMS()
   const [data, form] = useLocalForm({
     id: props.fileRelativePath, // needs to be unique
     label: 'Info Page',
 
     // starting values for the post object
     initialValues: {
       fileRelativePath: props.fileRelativePath,
       frontmatter: props.data,
       markdownBody: props.content,
     },
 
     // field definition
     fields: [
       {
         name: 'frontmatter.background_color',
         label: 'Background Color',
         component: 'color'
       },
       {
         name: 'markdownBody',
         label: 'Info Content',
         component: 'markdown',
       },
       
     ],
 
     // save & commit the file when the "save" button is pressed
     onSubmit(data) {
       return cms.api.git
         .writeToDisk({
           fileRelativePath: props.fileRelativePath,
           content: toMarkdownString(formState.values),
         })
         .then(() => {
           return cms.api.git.commit({
             files: [props.fileRelativePath],
             message: `Commit from Tina: Update ${data.fileRelativePath}`,
           })
         })
     },
   })
 
   const writeToDisk = React.useCallback(formState => {
     cms.api.git.writeToDisk({
       fileRelativePath: props.fileRelativePath,
       content: toMarkdownString(formState.values),
     })
   }, [])
 
   useWatchFormValues(form, writeToDisk)
}