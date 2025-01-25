import { useState, useEffect } from "react";

export default function SearchableTable() {
  const [search, setSearch] = useState("");
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/partners")
      .then((response) => response.json())
      .then((data) => setPartners(data));
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setPartners(updatedData);
      }
    }
  };

  const filteredPartners = partners.filter((partner) =>
    partner.company.toLowerCase().includes(search.toLowerCase()) ||
    partner.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        style={{ marginBottom: "10px", display: "block" }}
      />
      <input
        type="text"
        placeholder="Search by company or type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "10px",
          padding: "8px",
          width: "100%",
          fontSize: "16px",
        }}
      />
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Company</th>
            <th>Type</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {filteredPartners.map((partner, index) => (
            <tr key={index}>
              <td>{partner.company}</td>
              <td>{partner.type}</td>
              <td>
                <a href={partner.website} target="_blank" rel="noopener noreferrer">
                  {partner.website}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
