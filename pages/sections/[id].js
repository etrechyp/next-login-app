import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from '../layout/common/navbar';
import SearchBar from '../layout/widgets/searchBar';
import { 
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Breadcrumbs,
  Link
} from '@mui/material';

const SectionViewPage = () => {
  const router = useRouter();

  const [section, setSection] = useState({});
  const [articles, setArticles] = useState([]);

  const fetchSection = async (name) => {
    try {
      const resp = await axios.get(`/api/sections?name=${name}`)
      if (resp.data && Array.isArray(resp.data)) {
        setSection(resp.data[0]);
      } else {
        console.error('Invalid response data:', resp.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchArticles = async (id) => {
    try {
      const resp = await axios.get(`/api/articles?section=${id}&pageNumber=1&pageSize=150`);
      if (resp.data && Array.isArray(resp.data)) {
        setArticles(resp.data);
      } else {
        console.error('Invalid response data:', resp.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const id = router.query.id;

    if (id !== undefined) {
      fetchSection(id);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (section._id) {
      fetchArticles(section._id);
    }
  }, [section]);

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div>
      <Navbar />
      <SearchBar />
      <br />
      <Container>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            sections
          </Link>
          <Typography color="text.primary">{section.name}</Typography>
        </Breadcrumbs>
        <h1>{section.name}</h1>
        <h3>Articles</h3>
        <Grid container spacing={2}>
          {articles.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: 225 }}>
                <CardActionArea sx={{ height: 225 }} href={`/articles/${article._id}`}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {article.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stripHtmlTags(article.content).length > 300
                        ? `${stripHtmlTags(article.content).slice(0, 300)}...`
                        : stripHtmlTags(article.content)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default SectionViewPage;
