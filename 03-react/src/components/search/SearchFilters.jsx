function SearchFilters() {
return (
    <div className="search-filters">
                        <select name="technology" id="filter-technology">
                            <option value>Tecnología</option>

                            <optgroup label="Tecnologías Frontend">
                                <option value="javascript">JavaScript</option>
                                <option value="react">React</option>
                                <option value="angular">Angular</option>
                            </optgroup>

                            <optgroup label="Tecnologías Backend">
                                <option value="nodejs">Node.js</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="csharp">C#</option>
                                <option value="c">C</option>
                                <option value="c++">C++</option>
                                <option value="ruby">Ruby</option>
                                <option value="php">PHP</option>
                            </optgroup>
                        </select>

                        <select name="location" id="filter-location">
                            <option value>Ubicación</option>
                            <option value="remoto">Remoto</option>
                            <option value="cdmx">Ciudad de México</option>
                            <option value="guadalajara">Guadalajara</option>
                            <option value="monterrey">Monterrey</option>
                            <option value="barcelona">Barcelona</option>
                            <option value="madrid">Madrid</option>
                            <option value="ba">Buenos Aires</option>
                        </select>

                        <select name="experience-level"
                            id="filter-experience-level">
                            <option value>Nivel de experiencia</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid-level</option>
                            <option value="senior">Senior</option>
                            <option value="lead">Lead</option>
                        </select>
                    </div>
)
}

export default SearchFilters