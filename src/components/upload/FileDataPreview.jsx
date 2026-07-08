import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

export default function FileDataPreview({
  data,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading,
  error,
}) {
  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    )
  }

  if (!data && loading) {
    return (
      <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={28} />
      </Paper>
    )
  }

  if (!data) return null

  const { columns = [], rows = [], total_rows: totalRows = 0, filename } = data
  const pageIndex = page - 1

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="overline" color="primary">
            File preview
          </Typography>
          <Typography variant="h6">
            {filename ?? 'Uploaded file'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalRows === 0
              ? 'No rows found in file'
              : `${totalRows.toLocaleString()} rows — select columns and describe a pattern below`}
          </Typography>
        </Box>

        {totalRows === 0 ? (
          <Alert severity="info">The file appears to be empty.</Alert>
        ) : (
          <>
            <TableContainer
              sx={{
                maxHeight: 360,
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell key={col} sx={{ fontWeight: 600 }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, idx) => (
                    <TableRow key={`${page}-${idx}`} hover>
                      {columns.map((col) => (
                        <TableCell
                          key={col}
                          sx={{
                            maxWidth: 220,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {row[col] ?? ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalRows}
              page={pageIndex}
              rowsPerPage={pageSize}
              onPageChange={(_, newPage) => onPageChange(newPage + 1)}
              onRowsPerPageChange={(e) => {
                onPageSizeChange(Number(e.target.value))
              }}
              rowsPerPageOptions={[25, 50, 100]}
              disabled={loading}
            />
          </>
        )}

        {loading && rows.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Loading…
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}
