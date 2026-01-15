import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const VeteransOverview = () => {
  return (
    <div style={{ fontFamily: "Oswald, sans-serif", color: "#333" }}>
      {/* ================= HERO ================= */}
      <div
        style={{
          backgroundImage:
            "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(60,115,104,0.6)",
          }}
        />
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "42px" }}>
            Veterans Overview
          </h1>
        </div>
      </div>

      {/* ================= SUB NAV ================= */}
      <Container className="py-4 text-center">
        <p style={{ fontSize: "14px" }}>
          <strong>Veterans Overview</strong> |{" "}
          <Link to="/veterans-headstones">Veterans Headstones</Link> |{" "}
          <Link to="/veterans-burial-flags">Veterans Burial Flags</Link>
        </p>
      </Container>

      <hr />

      {/* ================= CONTENT ================= */}
      <Container className="pb-5">
        <Row>
          {/* LEFT COLUMN */}
          <Col md="8">
            <p>
              The basic Military Funeral Honors (MFH) ceremony consists of the
              folding and presentation of the United States flag to the veteran’s
              family and the playing of Taps. The ceremony is performed by a
              funeral honors detail consisting of at least two Pallbearers
              requested by the veteran/family.
            </p>

            <h6 style={{ fontWeight: "700" }}>
              Who is eligible for Military Funeral Honors?
            </h6>
            <ul>
              <li>Military members on active duty or in the Selected Reserve.</li>
              <li>
                Former military members who served on active duty and departed
                under conditions other than dishonorable.
              </li>
              <li>
                Former military members who completed at least one term of
                enlistment or period of initial obligated service in the Selected
                Reserve and departed under conditions other than dishonorable.
              </li>
              <li>
                Former military members discharged from the Selected Reserve due
                to a disability incurred or aggravated in the line of duty.
              </li>
            </ul>

            <h6 style={{ fontWeight: "700", marginTop: "30px" }}>
              How do I establish eligibility?
            </h6>
            <p>
              The preferred method is the <strong>DD Form 214</strong>,
              Certificate of Release or Discharge from Active Duty. If the family
              does not have the DD Form 214, the funeral director can assist in
              obtaining it or other necessary documentation to verify eligibility.
            </p>
            <p>
              We are honored to help families navigate the process of securing
              military honors for their loved ones. Please contact us if you need
              assistance locating these documents.
            </p>
          </Col>

          {/* RIGHT COLUMN / SIDEBAR */}
          <Col md="4">
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "30px",
                border: "1px solid #dee2e6",
                marginBottom: "30px",
              }}
            >
              <h5
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: "bold",
                }}
              >
                Have Questions?
              </h5>
              <hr />
              <p style={{ fontSize: "15px" }}>
                If you are unsure about eligibility or need immediate assistance
                planning a veteran's service, please reach out to our staff.
              </p>
              <button className="btn btn-dark btn-block w-100">
                Contact Us
              </button>
            </div>

            {/* Placeholder for sidebar image */}
            <div
              style={{
                backgroundColor: "#ccc",
                height: "250px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
              }}
            >
              <span>Sidebar Image Area</span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VeteransOverview;