function Arete(crayon,noeud1,noeud2,direction,couleurs,epaisseures,nom,coordonnee_nom,D) {
	
	this.crayon = crayon;
	this.noeud1 = noeud1;
	this.noeud2 = noeud2;
	this.direction = direction;//0,1 ou 2 pour : non-orienté, sens direct, sens inverse
	this.couleurs = couleurs;
	this.epaisseures = epaisseures;
	this.nom = nom;
	this.coordonnee_nom = coordonnee_nom;// nombre entre 0 et 1
	this.ETAT = 0;
	this.D = D;
	
	this.x1_centre;
	this.x2_centre;
	this.y1_centre;
	this.y2_centre;

	this.x1_decale;
	this.x2_decale;
	this.y1_decale;
	this.y2_decale;

	this.theta;

	this.centrer = true;

	this.oriente = false;

	this.update_coordonnes = function(){
		//fonction qui met a jours les coordonnées de l'arête
		info1 = this.noeud1.getInfos();
		info2 = this.noeud2.getInfos();
		var x1 = info1[0];
		var x2 = info2[0];
		var y1 = info1[1];
		var y2 = info2[1];
		var R1 = info1[2];
		var R2 = info2[2];
		var type1 = info1[4];
		var type2 = info2[4];


		if(type2 == "Cercle" && type1=="Cercle"){
			//calcul des coordonnées pour la cas non orienté
			var dx = x2-x1;
			var dy = y2-y1;
			if(dx == 0){
				dx = 0.0001;
			}
			var theta = Math.atan(dy/dx);
			if(dx<0){
				theta = Math.PI + theta;
			}
			this.theta = theta;

			this.x1_centre = x1+R1*Math.cos(theta);
			this.y1_centre = y1+R1*Math.sin(theta);

			this.x2_centre = x2-R2*Math.cos(theta);
			this.y2_centre = y2-R2*Math.sin(theta);
			//calcul pour le cas orienté

			var phi1 = Math.asin(this.D);
			var phi2 = Math.asin(this.D);

			this.x1_decale = x1+R1*Math.cos(theta+phi1);
			this.y1_decale = y1+R1*Math.sin(theta+phi1);

			this.x2_decale = x2-R2*Math.cos(theta-phi2);
			this.y2_decale = y2-R2*Math.sin(theta-phi2);
		}
	}
	
	this.update_coordonnes();
	
	
	
	this.triangle = function(x,y,r,theta,omega){
	//fonction qui trace un triangle allant de 1 vers 2 de rayon r et d'angle 2*theta, incline d'un angle omega
			
			//écart du premier point
			var ax = r*Math.cos(omega+theta);
			var ay = r*Math.sin(omega+theta);

			//écart du premier point
			var bx = r*Math.cos(omega-theta);
			var by = r*Math.sin(omega-theta);

			this.crayon.beginPath();
			
			this.crayon.fillStyle = this.couleurs[this.ETAT];
			this.crayon.moveTo(x,y);
			this.crayon.lineTo(x+ax,y+ay);
			this.crayon.lineTo(x+bx,y+by);
			this.crayon.closePath();
			this.crayon.fill();
			this.crayon.stroke();
	}

	this.tracer = function(ponderation,oriente){
		if(this.noeud1.isVisible() && this.noeud2.isVisible()){

			this.oriente = oriente;// memorise le dernier etat où elle a ete tracée

			this.crayon.strokeStyle = this.couleurs[this.ETAT];
			this.crayon.lineWidth = this.epaisseures[this.ETAT]; 
	
			if(this.centrer || !oriente){
				var x1 = this.x1_centre;
				var x2 = this.x2_centre;
				var y1 = this.y1_centre;
				var y2 = this.y2_centre;
			}
			else{
				var x1 = this.x1_decale;
				var x2 = this.x2_decale;
				var y1 = this.y1_decale;
				var y2 = this.y2_decale;
			}
			
			this.crayon.beginPath();
				
			this.crayon.moveTo(x1,y1);
			this.crayon.lineTo(x2,y2);
			
			this.crayon.stroke();

			if(oriente){
				if(this.direction==1){
				this.triangle(x2,y2,15,0.4,Math.PI+this.theta);
				}
				else if(this.direction == 2){
					this.triangle(x1,y1,15,0.4,this.theta);
				}
			}

			if(ponderation){
			
				this.crayon.beginPath();
				this.crayon.fillStyle = "white";

				this.crayon.arc(Math.round( this.coordonnee_nom *(x1+x2) / 2 ) , Math.round( this.coordonnee_nom *(y1+y2)/2), 10 , 0 , Math.PI*2 , true);
				this.crayon.fill();

				this.crayon.fillStyle = this.couleurs[this.ETAT];
				this.crayon.font = "12pt Verdana";
				this.crayon.textAlign="center";
				this.crayon.textBaseline="middle";
				this.crayon.fillText(this.nom,Math.round( this.coordonnee_nom *(x1+x2) / 2 ) , Math.round( this.coordonnee_nom *(y1+y2)/2));
			}

		}
	}
	
	this.In = function(x,y){
		var epsilon = 20;
		
		
		if(this.centrer || !this.oriente){
			var x1 = this.x1_centre;
			var x2 = this.x2_centre;
			var y1 = this.y1_centre;
			var y2 = this.y2_centre;
		}
		else{
			var x1 = this.x1_decale;
			var x2 = this.x2_decale;
			var y1 = this.y1_decale;
			var y2 = this.y2_decale;
		}
		
		if(Math.abs(x1-x2)<0.5 && Math.abs(x-x1)<epsilon ){//trait vertical
			return true;
		}
		else if(Math.abs(y1-y2)<0.5 && Math.abs(y-y1)<epsilon){
			return true;
		}
		
		else if(x>=Math.min(x1,x2) && x<=Math.max(x1,x2) && y>=Math.min(y1,y2) &&  y<=Math.max(y1,y2) ){
			//les egals sont important pour les cas ou la droite est horizontale/varticale
			var a = (y2-y1)/(x2-x1);
			var y_theorique = y1+a*(x-x1);
				
			if(Math.abs(y-y_theorique)<epsilon){
				return true;
			}
		}
		return false;
	}
	
	this.getInfos = function(){
		var info1 = this.noeud1.getInfos();
		var info2 = this.noeud2.getInfos(); 
		
		var info = info1.concat(info2);
		return info;
	}
	
	
}
