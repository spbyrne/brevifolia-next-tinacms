export function remarkForm(Component, options) {
  return function RemarkForm(props) {
    const [markdownRemark] = useLocalRemarkForm(
      getMarkdownRemark(props.data, options.queryName),
      options
    )

    return <Component {...props} data={{ ...props.data, markdownRemark }} />
  }
}