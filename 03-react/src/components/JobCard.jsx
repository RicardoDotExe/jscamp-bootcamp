function JobCard({ job }) {
  return (
    <div>
        <h3>{job?.title}</h3>
        <small>{job?.company} | ${job?.location}</small>
        <p >{job?.company}</p>

    <button className="button-apply-job">Aplicar</button>
    </div>
  )
}

export default JobCard