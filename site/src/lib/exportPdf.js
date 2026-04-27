import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportDashboardAsPdf(dashboardEl) {
  if (!dashboardEl) throw new Error('No dashboard element');

  // Clone the dashboard into an off-screen stage so the snapshot is
  // not affected by the user's viewport / scroll position.
  const stage = document.createElement('div');
  stage.className = 'export-stage';
  const clone = dashboardEl.cloneNode(true);
  clone.hidden = false;
  // Remove the download button itself from the snapshot.
  const btnInside = clone.querySelector('.btn-download');
  if (btnInside) btnInside.remove();
  stage.appendChild(clone);
  document.body.appendChild(stage);

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: '#0a0c14',
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 1100,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 28;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;

    const imgW = usableW;
    const imgH = (canvas.height * imgW) / canvas.width;

    if (imgH <= usableH) {
      pdf.addImage(canvas, 'PNG', margin, margin, imgW, imgH);
    } else {
      let remaining = imgH;
      let yOffset = 0;
      while (remaining > 0) {
        pdf.addImage(canvas, 'PNG', margin, margin - yOffset, imgW, imgH);
        remaining -= usableH;
        yOffset += usableH;
        if (remaining > 0) pdf.addPage();
      }
    }

    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 160);
      pdf.text(
        `Unbiased AI · Bias Analysis Report · Page ${i} of ${totalPages}`,
        margin,
        pageH - 12
      );
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    pdf.save(`unbiased-ai-report-${stamp}.pdf`);
  } finally {
    stage.remove();
  }
}
